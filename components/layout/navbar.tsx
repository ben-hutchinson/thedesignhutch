"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandLockup } from "@/components/brand/logo";
import { navItems } from "@/content/site";
import { trackCtaClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

import { buttonStyles } from "../ui/button";

const mobileMenuMotion = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function normalizePath(path: string) {
  if (path === "/") {
    return path;
  }

  return path.replace(/\/$/, "");
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activePath = normalizePath(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "bg-base-950/92 border-b border-white/10 shadow-card backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-shell flex h-16 items-center justify-between gap-4 sm:h-[4.35rem]">
        <Link
          href="/"
          className="cta-focus rounded-xl"
          aria-label="The Design Hutch home"
        >
          <BrandLockup
            compact
            markClassName="shadow-[0_0_24px_rgba(53,39,154,0.5)]"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-sm font-medium tracking-[0.01em] transition after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:bg-gradient-to-r after:from-accent-blue after:to-accent-orange after:transition-transform",
                activePath === item.href
                  ? "text-white after:scale-x-100"
                  : "text-zinc-300 after:scale-x-0 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="relative hidden md:block">
          <Link
            href="/contact"
            className={buttonStyles({ size: "md" })}
            aria-label="Book free consultation"
            onClick={() =>
              trackCtaClick({
                ctaId: "navbar_primary",
                source: "navbar",
                destination: "/contact",
              })
            }
          >
            <span className="relative z-[1]">Book Free Consultation</span>
          </Link>
          <span className="pointer-events-none absolute -right-1 -top-1 inline-flex h-2.5 w-2.5 rounded-full bg-accent-orange/80 shadow-[0_0_0_5px_rgba(249,115,22,0.16)]" />
        </div>

        <button
          type="button"
          className="cta-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em]">
            {menuOpen ? "Close" : "Menu"}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            {...mobileMenuMotion}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden"
          >
            <div className="border-t border-white/10 bg-base-900/95 pb-8 pt-6 backdrop-blur-lg">
              <nav
                className="container-shell flex flex-col gap-3"
                aria-label="Mobile"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-base transition",
                      activePath === item.href
                        ? "border-accent-blue/35 bg-accent-blue/10 text-white"
                        : "border-transparent text-zinc-200 hover:border-white/10 hover:bg-white/[0.04]",
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className={cn(buttonStyles({}), "mt-2 w-full")}
                  onClick={() => {
                    setMenuOpen(false);
                    trackCtaClick({
                      ctaId: "navbar_mobile_primary",
                      source: "navbar",
                      destination: "/contact",
                    });
                  }}
                >
                  <span className="relative z-[1]">Book Free Consultation</span>
                </Link>
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
