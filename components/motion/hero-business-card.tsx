"use client";

import { useRef, useState } from "react";

import { LogoMark } from "@/components/brand/logo";
import { contactDetails } from "@/content/site";

export function HeroBusinessCard() {
  const [side, setSide] = useState<"front" | "back">("front");
  const pointerStart = useRef<number | null>(null);
  const pointerLast = useRef<number | null>(null);
  const didDrag = useRef(false);

  const settleDrag = () => {
    if (pointerStart.current === null || pointerLast.current === null) return;
    const distance = pointerLast.current - pointerStart.current;
    if (distance < -60) setSide("back");
    if (distance > 60) setSide("front");
    pointerStart.current = null;
    pointerLast.current = null;
  };

  return (
    <div className="relative mx-auto w-[92%] max-w-[35rem] rotate-[7deg] [perspective:1200px] md:mx-0 md:rotate-[10deg]">
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
        className="cta-focus relative block aspect-[25/14] w-full touch-pan-y select-none bg-transparent text-left [transform-style:preserve-3d]"
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
          pointerLast.current = event.clientX;
          didDrag.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          pointerLast.current = event.clientX;
          if (
            pointerStart.current !== null &&
            Math.abs(event.clientX - pointerStart.current) > 8
          )
            didDrag.current = true;
        }}
        onPointerUp={(event) => {
          pointerLast.current = event.clientX;
          settleDrag();
        }}
        onPointerCancel={settleDrag}
      >
        <span className="absolute inset-0 overflow-hidden border border-white/25 bg-[#204dbf] p-[clamp(1.2rem,4vw,2.2rem)] text-white shadow-[0_7px_0_#f0642b,0_35px_42px_-22px_rgba(0,0,0,.95)] [backface-visibility:hidden]">
          <span className="absolute inset-0 opacity-25 [background-image:repeating-radial-gradient(circle_at_30%_20%,transparent_0,rgba(255,255,255,.12)_1px,transparent_2px,transparent_5px)]" />
          <span className="relative flex h-full items-center justify-center">
            <span className="inline-flex items-center gap-4 sm:gap-6">
              <LogoMark className="h-[clamp(3.8rem,11vw,6.8rem)] w-[clamp(3.8rem,11vw,6.8rem)]" />
              <span className="font-heading text-[clamp(1.7rem,5vw,3.7rem)] leading-none tracking-[-.045em]">
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
