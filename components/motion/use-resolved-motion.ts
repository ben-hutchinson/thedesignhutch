"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export function useResolvedMotion() {
  const motionReduced = useReducedMotion();
  const [browserReduced, setBrowserReduced] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setBrowserReduced(mediaQuery.matches);

    setHydrated(true);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return {
    hydrated,
    reduced: Boolean(motionReduced || browserReduced),
  };
}
