"use client";

import { useRef, useState } from "react";

import { LogoMark } from "@/components/brand/logo";
import { contactDetails } from "@/content/site";

export function HeroBusinessCard() {
  const [side, setSide] = useState<"front" | "back">("front");
  const pointerStart = useRef<number | null>(null);
  const mouseStart = useRef<number | null>(null);
  const didDrag = useRef(false);

  return (
    <div className="relative mx-auto w-[68%] max-w-[38.5rem] translate-x-4 rotate-[-7deg] [perspective:1200px] md:mx-0 md:w-[94%] md:translate-x-0 md:rotate-[-10deg]">
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 -rotate-[10deg] border border-white/20"
      />
      <button
        type="button"
        data-testid="hero-business-card"
        aria-label={`Design Hutch card, showing ${side}`}
        aria-describedby="hero-card-instructions"
        aria-pressed={side === "back"}
        data-side={side}
        data-auto-rotate="false"
        className="cta-focus relative block aspect-[25/14] w-full touch-none select-none bg-transparent text-left [transform-style:preserve-3d]"
        onDragStart={(event) => event.preventDefault()}
        style={{
          transform: `rotateY(${side === "back" ? 180 : 0}deg)`,
          transition: "transform 650ms cubic-bezier(.22,1,.36,1)",
        }}
        onClick={() => {
          if (didDrag.current) {
            didDrag.current = false;
            return;
          }
          setSide((current) => (current === "front" ? "back" : "front"));
        }}
        onPointerDown={(event) => {
          pointerStart.current = event.clientX;
          didDrag.current = false;
        }}
        onPointerMove={(event) => {
          if (pointerStart.current !== null) {
            const distance = event.clientX - pointerStart.current;
            if (distance < -60) setSide("back");
            if (distance > 60) setSide("front");
            if (Math.abs(distance) > 8) {
              didDrag.current = true;
            }
          }
        }}
        onPointerUp={(event) => {
          const distance = event.clientX - (pointerStart.current ?? event.clientX);
          didDrag.current = Math.abs(distance) > 8;
          if (distance < -60) setSide("back");
          if (distance > 60) setSide("front");
          pointerStart.current = null;
        }}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
        onMouseDown={(event) => {
          mouseStart.current = event.clientX;
          didDrag.current = false;
        }}
        onMouseMove={(event) => {
          if (mouseStart.current === null) return;
          const distance = event.clientX - mouseStart.current;
          if (distance < -60) setSide("back");
          if (distance > 60) setSide("front");
          if (Math.abs(distance) > 8) didDrag.current = true;
        }}
        onMouseUp={() => {
          mouseStart.current = null;
        }}
      >
        <span className="absolute inset-0 overflow-hidden border border-white/25 bg-[#204dbf] p-[clamp(1.2rem,4vw,2.2rem)] text-white shadow-[0_7px_0_#f0642b,0_35px_42px_-22px_rgba(0,0,0,.95)] [backface-visibility:hidden]">
          <span className="absolute inset-0 opacity-25 [background-image:repeating-radial-gradient(circle_at_30%_20%,transparent_0,rgba(255,255,255,.12)_1px,transparent_2px,transparent_5px)]" />
          <span className="relative flex h-full items-center justify-center">
            <span className="inline-flex flex-col items-center gap-3 sm:gap-4">
              <LogoMark className="h-[clamp(4.2rem,11vw,7.6rem)] w-[clamp(4.85rem,12.5vw,8.8rem)]" />
              <span className="whitespace-nowrap font-heading text-[clamp(1.7rem,4.1vw,3.1rem)] leading-none tracking-[-.045em]">
                The Design Hutch
              </span>
            </span>
          </span>
        </span>

        <span className="absolute inset-0 overflow-hidden border border-white/20 bg-[#f0642b] p-[clamp(1.2rem,4vw,2.2rem)] text-[#171914] shadow-[0_40px_90px_-45px_rgba(240,100,43,.8)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(24,26,23,.25)_1px,transparent_1px)] [background-size:100%_28px]" />
          <span className="relative flex h-full flex-col">
            <span className="text-[.62rem] font-bold uppercase tracking-[.2em]">
              Founder + developer
            </span>
            <span className="mt-auto font-heading text-[clamp(2rem,6vw,4rem)] leading-none tracking-[-.05em]">
              Ben
              <br />
              Hutchinson
            </span>
            <span className="mt-3 text-[clamp(.68rem,2vw,.95rem)] font-semibold">
              {contactDetails.email}
            </span>
          </span>
        </span>
      </button>
      <p id="hero-card-instructions" className="sr-only">
        Drag, tap, or press Enter or Space to turn the card.
      </p>
    </div>
  );
}
