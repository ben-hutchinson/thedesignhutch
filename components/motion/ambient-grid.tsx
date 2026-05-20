"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AmbientGrid() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:52px_52px] opacity-30"
      />
    );
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:52px_52px]"
      animate={{
        backgroundPositionX: ["0px", "52px"],
        backgroundPositionY: ["0px", "52px"],
      }}
      transition={{
        duration: 24,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
      style={{ opacity: 0.3 }}
    />
  );
}
