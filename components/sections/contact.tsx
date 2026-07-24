"use client";

import Script from "next/script";
import { type FormEvent, type ReactNode, useState } from "react";

import { SectionShell } from "@/components/layout/section-shell";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { Textarea } from "@/components/ui/textarea";
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
  "Thanks, your enquiry is in. I'll reply within 1 business day.";
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
      className="bg-base-950 text-[#f5f1e7]"
      withTransition={false}
    >
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      ) : null}
      <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:gap-20">
        <div>
          <SectionHeading
            level={headingLevel}
            eyebrow="05"
            title="Let’s make your website easier to trust"
            description="Start with a free, practical review of what your current site needs to improve."
          />
          <p className="mt-6 rotate-[-2deg] font-heading text-2xl italic text-accent-orange">
            I reply personally within one business day.
          </p>
          <ul className="paper-grid mt-10 grid rotate-[-1.5deg] gap-0 border border-[#181a17] p-5 text-[#181a17] shadow-[8px_10px_24px_rgba(0,0,0,.35)]">
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
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <a
              href={contactDetails.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonStyles({ variant: "secondary" }),
                "text-white",
              )}
              onClick={() =>
                trackCtaClick({
                  ctaId: "contact_calendly_external",
                  source: "contact",
                  destination: contactDetails.calendlyUrl,
                })
              }
            >
              Book a free consultation
            </a>
            <a
              href={`mailto:${contactDetails.email}`}
              className="self-center font-semibold text-[#bdbeb6] underline decoration-accent-orange underline-offset-4"
            >
              {contactDetails.email}
            </a>
          </div>
        </div>

        <form
          className="drafting-corner paper-grid border border-[#181a17] p-6 text-[#181a17] shadow-[14px_14px_0_#3453d1] sm:p-9"
          action={contactDetails.contactFormEndpoint}
          method="POST"
          onSubmit={handleSubmit}
          noValidate
        >
          <p className="mb-7 border-b border-[#181a17] pb-3 text-[.64rem] font-bold uppercase tracking-[.18em]">
            Project note / 001
          </p>
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
          <div className="grid gap-5 sm:grid-cols-2">
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
                placeholder="you@business.com"
                value={values.email}
                onChange={(event) => change("email", event.target.value)}
                required
              />
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Business">
              <Input
                name="business"
                placeholder="Business name"
                value={values.business}
                onChange={(event) => change("business", event.target.value)}
                required
              />
            </Field>
          </div>
          <div className="mt-5">
            <Field label="What should your website improve?">
              <Textarea
                name="enquiry"
                rows={5}
                placeholder="The problem, goal, or opportunity..."
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
            className="mt-6 w-full"
            disabled={state.loading}
          >
            {state.loading ? "Sending..." : "Send my enquiry"}
          </Button>
          <p className="mt-4 text-center text-[.63rem] text-[#66675f]">
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
      </div>
    </SectionShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="text-[.62rem] font-bold uppercase tracking-[.14em]">
        {label}
      </span>
      {children}
    </label>
  );
}
