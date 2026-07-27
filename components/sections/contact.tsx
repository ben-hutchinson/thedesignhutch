"use client";

import Script from "next/script";
import { type FormEvent, type ReactNode, useState } from "react";

import { SectionShell } from "@/components/layout/section-shell";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { consultationChecklist, contactDetails } from "@/content/site";
import { trackCtaClick, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { contactSchema, type ContactFormValues } from "@/lib/validation";

type FormState = {
  loading: boolean;
  success: string | null;
  error: string | null;
};
type ContactApiResponse = { ok?: boolean; message?: string };
type TurnstileWindow = Window & { turnstile?: { reset: () => void } };

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  business: "",
  currentWebsite: "",
  enquiry: "",
  website: "",
};
const successMessage =
  "Thanks, your enquiry is in. I'll reply personally as soon as I can.";
const fallbackError =
  "Something went wrong while sending your message. Please email directly instead.";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactSection({
  headingLevel = "h1",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [state, setState] = useState<FormState>({
    loading: false,
    success: null,
    error: null,
  });
  const change = <K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K],
  ) => setValues((current) => ({ ...current, [key]: value }));
  const resetTurnstile = () => (window as TurnstileWindow).turnstile?.reset();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      setState({
        loading: false,
        success: null,
        error:
          parsed.error.issues[0]?.message ??
          "Please check your details and try again.",
      });
      return;
    }
    if (turnstileSiteKey && !turnstileToken) {
      setState({
        loading: false,
        success: null,
        error: "Please complete the verification check and try again.",
      });
      resetTurnstile();
      return;
    }
    try {
      setState({ loading: true, success: null, error: null });
      trackEvent("contact_form_submit", { source: "contact_section" });
      trackCtaClick({
        ctaId: "contact_submit",
        source: "contact",
        destination: contactDetails.contactFormEndpoint,
      });
      if (parsed.data.website.trim() !== "") {
        setState({ loading: false, success: successMessage, error: null });
        setValues(initialValues);
        resetTurnstile();
        return;
      }
      const body = new URLSearchParams({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        business: parsed.data.business,
        currentWebsite: parsed.data.currentWebsite,
        enquiry: parsed.data.enquiry,
        "cf-turnstile-response": turnstileToken,
        _subject: `New enquiry for The Design Hutch from ${parsed.data.name}`,
      });
      const response = await fetch(contactDetails.contactFormEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
      const result = (await response
        .json()
        .catch(() => null)) as ContactApiResponse | null;
      if (!response.ok || result?.ok === false)
        throw new Error(
          result?.message ??
            "Unable to send right now. Please use email instead.",
        );
      trackEvent("contact_form_success", { source: "contact_section" });
      setState({ loading: false, success: successMessage, error: null });
      setValues(initialValues);
      resetTurnstile();
    } catch (error) {
      trackEvent("contact_form_error", { source: "contact_section" });
      setState({
        loading: false,
        success: null,
        error: error instanceof Error ? error.message : fallbackError,
      });
      resetTurnstile();
    }
  };

  return (
    <SectionShell
      id="contact"
      className="relative overflow-hidden bg-base-950 !pb-16 !pt-[5.25rem] text-[#f5f1e7]"
      withTransition={false}
    >
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      ) : null}
      <div
        aria-hidden
        className="absolute -right-16 -top-10 hidden h-12 w-96 rotate-[25deg] border border-white/30 bg-[#262722] shadow-2xl lg:block"
      />
      <div className="grid gap-12 lg:grid-cols-[.96fr_1.04fr] lg:gap-16">
        <div className="lg:pl-10">
          <p
            data-section-number
            className="border-l border-accent-orange pl-7 font-heading text-3xl text-accent-orange"
          >
            06
          </p>
          {headingLevel === "h1" ? (
            <h1 className="mt-4 max-w-xl font-heading text-[clamp(3.8rem,6vw,6rem)] leading-[.9] tracking-[-.055em]">
              Let’s make your website easier to trust
            </h1>
          ) : (
            <h2 className="mt-4 max-w-xl font-heading text-[clamp(3.8rem,6vw,6rem)] leading-[.9] tracking-[-.055em]">
              Let’s make your website easier to trust
            </h2>
          )}
          <p className="mt-6 max-w-lg border-t border-white/35 pt-4 text-lg leading-relaxed text-[#bbbcb5]">
            Start with a free, practical review of what your current site needs
            to improve.
          </p>
          <p className="mt-6 rotate-[-2deg] font-heading text-2xl italic text-accent-orange">
            I reply to you personally as soon as I can.
          </p>
          <ul className="paper-grid mt-10 grid max-w-[27.5rem] rotate-[-1.5deg] gap-0 border border-[#181a17] p-5 text-[#181a17] shadow-[8px_10px_24px_rgba(0,0,0,.35)] lg:ml-14">
            {consultationChecklist.map((item) => (
              <li
                key={item}
                className="flex items-center gap-4 border-b border-[#181a17]/35 py-3 font-heading text-xl last:border-0"
              >
                <span className="flex h-5 w-5 items-center justify-center border border-[#181a17] font-body text-sm font-bold text-accent-blue">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full max-w-[36rem]">
          <form
            className="paper-grid border border-[#181a17] p-6 text-[#181a17] shadow-[14px_18px_34px_rgba(0,0,0,.42)] sm:p-8"
            action={contactDetails.contactFormEndpoint}
            method="POST"
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              type="hidden"
              name="_subject"
              value="New enquiry for The Design Hutch"
            />
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] h-px w-px opacity-0"
              value={values.website}
              onChange={(event) => change("website", event.target.value)}
              aria-hidden="true"
            />
            <div className="grid gap-3">
              <Field label="Name">
                <Input
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={values.name}
                  onChange={(event) => change("name", event.target.value)}
                  required
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={(event) => change("email", event.target.value)}
                  required
                />
              </Field>
            </div>
            <div className="mt-3">
              <Field label="Business">
                <Input
                  name="business"
                  placeholder="Your business or brand"
                  value={values.business}
                  onChange={(event) => change("business", event.target.value)}
                  required
                />
              </Field>
            </div>
            <div className="mt-3">
              <Field label="What should your website improve?">
                <Textarea
                  name="enquiry"
                  rows={3}
                  placeholder="Tell me what’s not working or what you’d like to improve."
                  value={values.enquiry}
                  onChange={(event) => change("enquiry", event.target.value)}
                  required
                />
              </Field>
            </div>
            {turnstileSiteKey ? (
              <div
                className="cf-turnstile mt-5"
                data-sitekey={turnstileSiteKey}
                data-theme="light"
              />
            ) : null}
            <Button
              type="submit"
              size="lg"
              className="mt-5 w-full justify-between normal-case tracking-normal"
              disabled={state.loading}
            >
              <span>{state.loading ? "Sending..." : "Send my enquiry"}</span>
              <ArrowIcon />
            </Button>
            <div className="my-6 flex items-center gap-4 text-xs text-[#77766f]">
              <span className="h-px flex-1 bg-[#181a17]/25" />
              or
              <span className="h-px flex-1 bg-[#181a17]/25" />
            </div>
            <a
              href={contactDetails.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonStyles({ variant: "ghost", size: "md" }),
                "mx-auto flex w-fit gap-3 border-0 normal-case tracking-normal text-accent-blue",
              )}
              onClick={() =>
                trackCtaClick({
                  ctaId: "contact_calendly_external",
                  source: "contact",
                  destination: contactDetails.calendlyUrl,
                })
              }
            >
              <CalendarIcon />
              Book a free consultation
            </a>
            <p className="text-center text-xs text-[#77766f]">
              Opens a scheduling page.
            </p>
            <p className="mt-5 text-center text-[.63rem] text-[#66675f]">
              Protected by Cloudflare Turnstile.
            </p>
            {state.success ? (
              <p className="mt-4 text-sm font-semibold text-emerald-700">
                {state.success}
              </p>
            ) : null}
            {state.error ? (
              <p className="mt-4 text-sm font-semibold text-rose-700">
                {state.error}
              </p>
            ) : null}
          </form>
          <a
            href={`mailto:${contactDetails.email}`}
            className="mt-8 inline-flex items-center gap-3 font-medium text-[#d2d2ca] underline decoration-accent-orange underline-offset-8"
          >
            <MailIcon />
            {contactDetails.email}
          </a>
        </div>
      </div>
    </SectionShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-semibold">{label}</span>
      {children}
    </label>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M4 6h16v14H4zM4 10h16M8 3v5m8-5v5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 28 20"
      className="h-5 w-7 text-accent-orange"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <rect x="1" y="1" width="26" height="18" />
      <path d="m2 3 12 9L26 3" />
    </svg>
  );
}
