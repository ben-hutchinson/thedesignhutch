import { type ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { Navbar } from "@/components/layout/navbar";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div
      id="top"
      className="relative min-h-screen overflow-hidden bg-base-950 text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-brand-radial opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015),transparent_30%,transparent_70%,rgba(255,255,255,0.012))]"
      />
      <Navbar />
      <main className="relative z-10 pb-24 pt-16 md:pb-0">{children}</main>
      <Footer />
      <MobileCta />
    </div>
  );
}
