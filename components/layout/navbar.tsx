"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandLockup } from "@/components/brand/logo";
import { buttonStyles } from "@/components/ui/button";
import { navItems } from "@/content/site";
import { trackCtaClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const escape = (event: KeyboardEvent) =>
      event.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", escape);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition duration-200",
        scrolled || menuOpen
          ? "border-white/15 bg-base-950/95 backdrop-blur-lg"
          : "border-transparent bg-base-950/65",
      )}
    >
      <div className="container-shell flex h-16 items-center justify-between gap-5">
        <Link
          href="/"
          className="cta-focus flex items-center gap-3 text-white"
          aria-label="The Design Hutch home"
        >
          <BrandLockup />
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "border-b py-1 text-[.65rem] font-bold uppercase tracking-[.13em] transition",
                pathname === item.href
                  ? "border-accent-orange text-white"
                  : "border-transparent text-[#b8b9b1] hover:border-white/40 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className={cn(buttonStyles({ size: "md" }), "hidden md:inline-flex")}
          onClick={() =>
            trackCtaClick({
              ctaId: "navbar_primary",
              source: "navbar",
              destination: "/contact",
            })
          }
        >
          Book a consultation
        </Link>
        <button
          type="button"
          className="cta-focus flex w-12 flex-col items-center gap-1 text-[.58rem] uppercase tracking-[.1em] text-white md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="block h-px w-8 bg-current" />
          <span className="block h-px w-8 bg-current" />
          <span className="block h-px w-8 bg-current" />
          <span>{menuOpen ? "Close" : "Menu"}</span>
        </button>
      </div>
      {menuOpen ? (
        <nav
          className="container-shell grid border-t border-white/15 bg-base-950 py-6 md:hidden"
          aria-label="Mobile"
        >
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between border-b border-white/15 py-4 font-heading text-3xl text-white"
            >
              <span>{item.label}</span>
              <span className="font-body text-[.6rem] text-accent-orange">
                0{index + 1}
              </span>
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
