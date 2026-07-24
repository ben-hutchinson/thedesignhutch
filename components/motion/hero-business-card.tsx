"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { contactDetails } from "@/content/site";

const TURN_DURATION_SECONDS = 1.05;
const IDLE_TURN_DELAY_MS = 4_000;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

function isBackRotation(rotation: number) {
  const halfTurns = Math.round(rotation / 180);
  return Math.abs(halfTurns % 2) === 1;
}

function HutOutline() {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className="h-full w-full">
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 74H78" strokeWidth="5" />
        <path d="M24 42L48 26L72 42" strokeWidth="5.5" />
        <path d="M29 43V73M67 43V73" strokeWidth="5.5" />
        <path d="M40 72V46H48V57H58V46H67" strokeWidth="5.5" />
        <path d="M67 73V57" strokeWidth="5.5" />
        <path
          d="M71 73C71 62 76 55 81 49C82 58 78 66 71 73Z"
          strokeWidth="4"
        />
        <path d="M72 73C78 70 84 68 88 62" strokeWidth="4" />
      </g>
    </svg>
  );
}

export function HeroBusinessCard() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rotationY = useMotionValue(0);
  const dragStartRotation = useRef(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const didPan = useRef(false);
  const [side, setSide] = useState<"front" | "back">("front");
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const isPaused = isHovered || isFocused || isPanning;

  const settle = useCallback(
    (target: number) => {
      const nextSide = isBackRotation(target) ? "back" : "front";
      setSide(nextSide);
      animationRef.current?.stop();

      if (prefersReducedMotion) {
        rotationY.set(nextSide === "back" ? 180 : 0);
        return;
      }

      animationRef.current = animate(rotationY, target, {
        duration: TURN_DURATION_SECONDS,
        ease: [0.22, 1, 0.36, 1],
      });
    },
    [prefersReducedMotion, rotationY],
  );

  const flip = useCallback(() => {
    const nearestHalfTurn = Math.round(rotationY.get() / 180) * 180;
    settle(nearestHalfTurn + 180);
  }, [rotationY, settle]);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) {
      return;
    }

    const timer = window.setTimeout(flip, IDLE_TURN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [flip, isPaused, prefersReducedMotion, side]);

  useEffect(
    () => () => {
      animationRef.current?.stop();
    },
    [],
  );

  return (
    <div className="relative [perspective:1200px]">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent-blue/10 blur-3xl" />
      <motion.button
        type="button"
        aria-label={`Design Hutch business card, showing ${side}`}
        aria-describedby="hero-card-instructions"
        aria-pressed={side === "back"}
        data-side={side}
        data-auto-rotate={!prefersReducedMotion}
        className="cta-focus relative block aspect-[25/14] w-full touch-pan-y select-none rounded-[1.35rem] text-left shadow-[0_34px_110px_-60px_rgba(59,130,246,0.95)] [transform-style:preserve-3d] [will-change:transform] active:cursor-grabbing sm:cursor-grab"
        style={{ rotateY: rotationY }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={() => {
          if (!didPan.current) {
            flip();
          }
        }}
        onPanStart={() => {
          didPan.current = false;
          setIsPanning(true);
          animationRef.current?.stop();
          dragStartRotation.current = rotationY.get();
        }}
        onPan={(_, info) => {
          didPan.current = Math.abs(info.offset.x) > 5;
          rotationY.set(dragStartRotation.current + info.offset.x * 0.45);
        }}
        onPanEnd={() => {
          settle(Math.round(rotationY.get() / 180) * 180);
          setIsPanning(false);
          window.setTimeout(() => {
            didPan.current = false;
          }, 0);
        }}
      >
        <span className="absolute inset-0 overflow-hidden rounded-[1.35rem] border border-white/10 bg-accent-blue [backface-visibility:hidden]">
          <Image
            src="/brand/design-hutch-logo-full.png"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
        </span>

        <span className="absolute inset-0 overflow-hidden rounded-[1.35rem] border border-white/15 bg-[linear-gradient(135deg,#ff8a1f_0%,#f97316_48%,#df5a0b_100%)] p-[clamp(1.1rem,4vw,2rem)] text-white shadow-[0_34px_110px_-60px_rgba(249,115,22,0.9)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_36%),linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.08)_48%,transparent_72%)]" />
          <span className="relative flex h-full flex-col">
            <span className="font-heading text-[clamp(1.25rem,4.5vw,2.2rem)] font-medium tracking-[-0.025em]">
              Ben Hutchinson
            </span>
            <span className="mt-2 text-[clamp(0.9rem,3vw,1.55rem)] font-medium text-orange-50/95">
              Founder &amp; Developer
            </span>
            <span className="mt-auto max-w-[78%] text-[clamp(0.78rem,3vw,1.35rem)] font-medium tracking-[-0.02em] text-white">
              {contactDetails.email}
            </span>
            <span className="absolute bottom-0 right-0 h-[clamp(2.5rem,9vw,4.5rem)] w-[clamp(2.5rem,9vw,4.5rem)] text-white/95">
              <HutOutline />
            </span>
          </span>
        </span>
      </motion.button>
      <p id="hero-card-instructions" className="sr-only">
        Drag, tap, or press Enter or Space to turn the card.
      </p>
    </div>
  );
}
