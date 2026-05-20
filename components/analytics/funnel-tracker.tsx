"use client";

import { useEffect, useMemo } from "react";

import { trackEvent } from "@/lib/analytics";

type FunnelTrackerProps = {
  sectionIds: string[];
};

export function FunnelTracker({ sectionIds }: FunnelTrackerProps) {
  const uniqueSectionIds = useMemo(
    () => Array.from(new Set(sectionIds.filter(Boolean))),
    [sectionIds],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const seenDepthMilestones = new Set<number>();
    const milestones = [25, 50, 75, 100];

    let ticking = false;
    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        const documentHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        if (documentHeight <= 0) {
          ticking = false;
          return;
        }

        const progress = Math.min(
          100,
          Math.round((window.scrollY / documentHeight) * 100),
        );

        milestones.forEach((milestone) => {
          if (progress >= milestone && !seenDepthMilestones.has(milestone)) {
            seenDepthMilestones.add(milestone);
            trackEvent("funnel_depth_reached", {
              depth_percent: milestone,
              path: window.location.pathname,
            });
          }
        });

        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || uniqueSectionIds.length === 0) {
      return;
    }

    const seenSections = new Set<string>();
    const nodes = uniqueSectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (nodes.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const id = entry.target.id;
          if (!id || seenSections.has(id)) {
            return;
          }

          seenSections.add(id);
          trackEvent("funnel_section_view", {
            section_id: id,
            path: window.location.pathname,
          });
        });
      },
      {
        rootMargin: "-18% 0px -45% 0px",
        threshold: 0.35,
      },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [uniqueSectionIds]);

  return null;
}
