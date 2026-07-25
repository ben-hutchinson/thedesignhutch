import Link from "next/link";

import { TrackedAnchor } from "@/components/analytics/tracked-link";
import { LogoMark } from "@/components/brand/logo";
import { contactDetails, navItems } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-white/20 bg-base-950 py-10 sm:py-12">
      <div className="container-shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          aria-label="The Design Hutch home"
          className="inline-flex w-fit items-center gap-5"
        >
          <LogoMark className="h-12 w-14" />
          <span>
            <span className="block font-heading text-2xl uppercase leading-none tracking-[.02em] text-[#f5f1e7]">
              The Design Hutch
            </span>
            <span className="mt-2 block text-[.58rem] uppercase tracking-[.28em] text-[#8d8e88]">
              Digital workshop
            </span>
          </span>
        </Link>

        <div className="space-y-4 md:text-right">
          <div className="flex flex-wrap gap-4 md:justify-end">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-zinc-400 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/privacy"
              className="text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              Privacy
            </Link>
          </div>
          <TrackedAnchor
            className="inline-flex text-sm text-zinc-300 transition hover:text-white"
            href={`mailto:${contactDetails.email}`}
            tracking={{
              ctaId: "footer_email",
              source: "footer",
              destination: `mailto:${contactDetails.email}`,
            }}
          >
            {contactDetails.email}
          </TrackedAnchor>
          <p className="text-xs text-zinc-400">
            (c) {new Date().getFullYear()} The Design Hutch.
          </p>
        </div>
      </div>
    </footer>
  );
}
