"use client";

import Script from "next/script";
import { type FormEvent, type ReactNode, useState } from "react";

import { SectionShell } from "@/components/layout/section-shell";
import { Reveal } from "@/components/motion/reveal";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

type ContactApiResponse = {
  ok?: boolean;
  message?: string;
};

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  business: "",
  currentWebsite: "",
  enquiry: "",
  website: "",
};

type CalendlyWindow = Window & {
  Calendly?: {
    initPopupWidget: (options: { url: string }) => void;
  };
  turnstile?: {
    reset: () => void;
  };
};

const contactSuccessMessage =
  "Thanks, your enquiry is in. I'll reply within 1 business day.";
const contactFallbackError =
  "Something went wrong while sending your message. Please email directly instead.";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactSection() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [state, setState] = useState<FormState>({
    loading: false,
    success: null,
    error: null,
  });

  const openCalendlyPopup = () => {
    trackCtaClick({
      ctaId: "contact_calendly_popup",
      source: "contact",
      destination: contactDetails.calendlyUrl,
    });

    const calendly = (window as CalendlyWindow).Calendly;

    if (calendly?.initPopupWidget) {
      calendly.initPopupWidget({ url: contactDetails.calendlyUrl });
      return;
    }

    window.open(contactDetails.calendlyUrl, "_blank", "noopener,noreferrer");
  };

  const handleChange = <K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const resetTurnstile = () => {
    (window as CalendlyWindow).turnstile?.reset();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");

    const parsed = contactSchema.safeParse(values);

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ??
        "Please check your details and try again.";
      setState({ loading: false, success: null, error: message });
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
      trackEvent("contact_form_submit", {
        source: "contact_section",
      });
      trackCtaClick({
        ctaId: "contact_submit",
        source: "contact",
        destination: contactDetails.contactFormEndpoint,
      });

      if (parsed.data.website.trim() !== "") {
        setState({
          loading: false,
          success: contactSuccessMessage,
          error: null,
        });
        setValues(initialValues);
        resetTurnstile();
        return;
      }

      const formBody = new URLSearchParams({
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
        body: formBody,
      });
      const result = (await response
        .json()
        .catch(() => null)) as ContactApiResponse | null;

      if (!response.ok || result?.ok === false) {
        throw new Error(
          result?.message ??
            "Unable to send right now. Please use email instead.",
        );
      }

      trackEvent("contact_form_success", {
        source: "contact_section",
      });
      setState({
        loading: false,
        success: contactSuccessMessage,
        error: null,
      });
      setValues(initialValues);
      resetTurnstile();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : contactFallbackError;
      trackEvent("contact_form_error", {
        source: "contact_section",
      });
      setState({
        loading: false,
        success: null,
        error: errorMessage,
      });
      resetTurnstile();
    }
  };

  return (
    <SectionShell
      id="contact"
      className="border-t border-white/10 bg-[radial-gradient(circle_at_15%_0%,rgba(59,130,246,0.18),transparent_38%),radial-gradient(circle_at_85%_40%,rgba(249,115,22,0.14),transparent_44%)]"
      withTransition={false}
    >
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      ) : null}

      <Reveal className="mb-10">
        <SectionHeading
          eyebrow="Contact"
          title="Book a free website consultation"
          description="Start with a practical review of what your current site needs to improve before committing to a redesign."
        />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <Reveal>
          <Card className="border-white/20 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]">
            <form
              className="space-y-4 sm:space-y-5"
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
                className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden opacity-0"
                value={values.website}
                onChange={(event) =>
                  handleChange("website", event.target.value)
                }
                aria-hidden="true"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <Input
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={values.name}
                    onChange={(event) =>
                      handleChange("name", event.target.value)
                    }
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
                    onChange={(event) =>
                      handleChange("email", event.target.value)
                    }
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone (optional)">
                  <Input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="Your number"
                    value={values.phone}
                    onChange={(event) =>
                      handleChange("phone", event.target.value)
                    }
                  />
                </Field>
                <Field label="Business">
                  <Input
                    name="business"
                    placeholder="Business name"
                    value={values.business}
                    onChange={(event) =>
                      handleChange("business", event.target.value)
                    }
                    required
                  />
                </Field>
              </div>

              <Field label="Current website (optional)">
                <Input
                  type="url"
                  name="currentWebsite"
                  autoComplete="url"
                  placeholder="https://yourbusiness.co.uk"
                  value={values.currentWebsite}
                  onChange={(event) =>
                    handleChange("currentWebsite", event.target.value)
                  }
                />
              </Field>

              <Field label="Enquiry">
                <Textarea
                  name="enquiry"
                  rows={6}
                  placeholder="What do you need, and what should this website improve?"
                  value={values.enquiry}
                  onChange={(event) =>
                    handleChange("enquiry", event.target.value)
                  }
                  required
                />
              </Field>

              {turnstileSiteKey ? (
                <div
                  className="cf-turnstile"
                  data-sitekey={turnstileSiteKey}
                  data-theme="dark"
                />
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={state.loading}
              >
                {state.loading ? "Sending..." : "Send Enquiry"}
              </Button>

              {state.success ? (
                <p className="text-sm text-emerald-400">{state.success}</p>
              ) : null}
              {state.error ? (
                <p className="text-sm text-rose-400">{state.error}</p>
              ) : null}
            </form>
          </Card>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="h-full">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Consultation Options
              </p>
              <h3 className="text-balance font-heading text-2xl text-white">
                What the free consultation includes.
              </h3>
              <p className="text-sm text-zinc-300">
                Use Calendly if you want to talk first. Prefer async? Email or
                use the form and I will respond with practical next steps.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {consultationChecklist.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-blue" />
                  <p className="text-sm text-zinc-200">{item}</p>
                </div>
              ))}
            </div>

            <div className="border-white/12 mt-5 overflow-hidden rounded-xl border bg-black/30">
              <div className="space-y-4 p-5">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    className="sm:w-auto"
                    onClick={openCalendlyPopup}
                  >
                    Open Booking Popup
                  </Button>
                  <a
                    href={contactDetails.calendlyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonStyles({ variant: "secondary" }),
                      "w-full justify-center sm:w-auto",
                    )}
                    onClick={() =>
                      trackCtaClick({
                        ctaId: "contact_calendly_external",
                        source: "contact",
                        destination: contactDetails.calendlyUrl,
                      })
                    }
                  >
                    <span className="relative z-[1]">Open in New Tab</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                Email
              </p>
              <a
                href={`mailto:${contactDetails.email}`}
                className="mt-2 inline-flex text-sm font-medium text-accent-blue transition hover:text-white"
                onClick={() =>
                  trackCtaClick({
                    ctaId: "contact_email",
                    source: "contact",
                    destination: `mailto:${contactDetails.email}`,
                  })
                }
              >
                {contactDetails.email}
              </a>
            </div>
          </Card>
        </Reveal>
      </div>
    </SectionShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-2 text-sm text-zinc-300">
      <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}
