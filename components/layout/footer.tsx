import Link from "next/link";

import { TrackedAnchor } from "@/components/analytics/tracked-link";
import { BrandLockup } from "@/components/brand/logo";
import { contactDetails, navItems } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-base-950 py-10 sm:py-12">
      <div className="container-shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <Link href="/" aria-label="The Design Hutch home" className="w-fit">
          <BrandLockup markClassName="w-44 sm:w-52" />
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
