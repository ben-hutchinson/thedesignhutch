import type { Metadata } from "next";
import Link from "next/link";

import { BrandLockup } from "@/components/brand/logo";
import { contactDetails, serviceAreas } from "@/content/site";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for The Design Hutch, covering contact enquiries, Calendly bookings, analytics, and website data.",
  alternates: {
    canonical: "/privacy",
  },
};

const policySections = [
  {
    title: "Information You Provide",
    body: [
      "When you submit the contact form, email directly, or book a consultation, The Design Hutch may collect your name, email address, optional phone number, business name, enquiry details, and any information you choose to share.",
      "This information is used to respond to enquiries, prepare for consultations, scope projects, and provide requested services.",
    ],
  },
  {
    title: "Contact Form And Email Delivery",
    body: [
      "Contact form submissions are validated before being processed. Anti-spam measures may check technical details such as IP address, submission timing, and hidden form fields.",
      "Email delivery may be handled by a third-party email provider such as Resend. If delivery fails, a fallback alert may be sent so the enquiry is not missed.",
    ],
  },
  {
    title: "Calendly Bookings",
    body: [
      "If you use the booking calendar, Calendly may process the information needed to schedule and manage your appointment.",
      "Calendly has its own privacy practices, so you should review Calendly's policy when booking through the embedded calendar or external booking page.",
    ],
  },
  {
    title: "Analytics",
    body: [
      "The website may use lightweight analytics to understand which calls to action, sections, and pages are useful to visitors.",
      "If Google Analytics is enabled, it may collect usage data such as page views, device information, referral source, and interaction events. This helps improve the website and enquiry flow.",
    ],
  },
  {
    title: "Cookies And Similar Technologies",
    body: [
      "The site may use cookies or similar browser storage when analytics, Calendly, or other third-party tools are enabled.",
      "Essential site functionality does not require an account or login.",
    ],
  },
  {
    title: "How Long Data Is Kept",
    body: [
      "Enquiry and booking information is kept only for as long as needed to respond, manage project discussions, maintain records, and meet reasonable business or legal requirements.",
      "You can ask for your information to be deleted where there is no ongoing business or legal reason to keep it.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "You can ask what personal information is held about you, request corrections, or ask for deletion where applicable.",
      `To make a privacy request, email ${contactDetails.email}.`,
    ],
  },
  {
    title: "Service Area",
    body: [
      `The Design Hutch works with local businesses across ${serviceAreas.join(
        " and ",
      )}, as well as remote clients where the project is a good fit.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-base-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(53,39,154,0.18),transparent_38%),linear-gradient(315deg,rgba(59,130,246,0.1),transparent_42%)]" />
      <div className="container-shell relative py-8 sm:py-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label={`${siteConfig.name} home`}>
            <BrandLockup markClassName="shadow-[0_0_28px_rgba(53,39,154,0.42)]" />
          </Link>
          <Link
            href="/"
            className="cta-focus w-fit rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-white/35 hover:text-white"
          >
            Back to site
          </Link>
        </header>

        <section className="max-w-3xl py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-blue">
            Privacy Policy
          </p>
          <h1 className="mt-4 text-balance font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl">
            How The Design Hutch handles enquiry and booking data.
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
            This policy explains what information is collected through the
            website, why it is used, and how to get in touch about privacy
            requests. Last updated 30 April 2026.
          </p>
        </section>

        <section className="grid gap-4 pb-16">
          {policySections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-card sm:p-6"
            >
              <h2 className="font-heading text-2xl font-semibold text-white">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-[0.95rem]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
