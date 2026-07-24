"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { trackCtaClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function MobileCta() {
  const pathname = usePathname();
  const [heroInView, setHeroInView] = useState(pathname === "/");
  const [contactInView, setContactInView] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const contact = document.getElementById("contact");
    const observers: IntersectionObserver[] = [];

    if (hero) {
      const observer = new IntersectionObserver(
        ([entry]) => setHeroInView(Boolean(entry?.isIntersecting)),
        { threshold: 0.05 },
      );
      observer.observe(hero);
      observers.push(observer);
    } else setHeroInView(false);

    if (contact) {
      const observer = new IntersectionObserver(
        ([entry]) => setContactInView(Boolean(entry?.isIntersecting)),
        { rootMargin: "0px 0px -18%", threshold: 0.05 },
      );
      observer.observe(contact);
      observers.push(observer);
    } else setContactInView(false);

    return () => observers.forEach((observer) => observer.disconnect());
  }, [pathname]);

  const hidden = heroInView || contactInView;
  return (
    <div
      data-testid="mobile-sticky-cta"
      aria-hidden={hidden}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-base-950/95 p-3 backdrop-blur-lg transition duration-200 md:hidden",
        hidden
          ? "invisible translate-y-full opacity-0"
          : "visible translate-y-0 opacity-100",
      )}
    >
      <Link
        href="/contact"
        className={cn(buttonStyles({ size: "md" }), "w-full")}
        onClick={() =>
          trackCtaClick({
            ctaId: "mobile_sticky_enquiry",
            source: "mobile_sticky",
            destination: "/contact",
          })
        }
      >
        Start a project
      </Link>
    </div>
  );
}
