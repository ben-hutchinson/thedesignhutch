"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { contactDetails } from "@/content/site";
import { trackCtaClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function MobileCta() {
  const pathname = usePathname();
  const [contactInView, setContactInView] = useState(false);

  useEffect(() => {
    const contactSection = document.getElementById("contact");

    if (!contactSection) {
      setContactInView(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setContactInView(Boolean(entry?.isIntersecting));
      },
      {
        rootMargin: "0px 0px -18% 0px",
        threshold: 0.08,
      },
    );

    observer.observe(contactSection);

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div
      data-testid="mobile-sticky-cta"
      aria-hidden={contactInView}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-base-950/95 p-3 backdrop-blur-xl transition-[transform,opacity,visibility] duration-300 md:hidden",
        contactInView
          ? "invisible translate-y-full opacity-0"
          : "visible translate-y-0 opacity-100",
      )}
    >
      <div className="container-shell flex gap-2 !px-0">
        <Link
          href="/contact"
          className={cn(buttonStyles({ size: "md" }), "flex-1 justify-center")}
          onClick={() =>
            trackCtaClick({
              ctaId: "mobile_sticky_enquiry",
              source: "mobile_sticky",
              destination: "/contact",
            })
          }
        >
          <span className="relative z-[1]">Send Enquiry</span>
        </Link>
        <a
          href={contactDetails.calendlyUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonStyles({ variant: "secondary", size: "md" }),
            "flex-1 justify-center",
          )}
          onClick={() =>
            trackCtaClick({
              ctaId: "mobile_sticky_book_call",
              source: "mobile_sticky",
              destination: contactDetails.calendlyUrl,
            })
          }
        >
          <span className="relative z-[1]">Book Free Consultation</span>
        </a>
      </div>
    </div>
  );
}
