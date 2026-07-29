"use client";

import { useRef, useState, type PointerEvent } from "react";

import { LogoMark } from "@/components/brand/logo";
import { contactDetails } from "@/content/site";

const DRAG_ACTIVATION_PX = 8;
const SNAP_MIDPOINT_DEGREES = 90;

type PointerGesture = {
  axis: "horizontal" | "vertical" | null;
  cardWidth: number;
  latestRotation: number;
  pointerId: number;
  startRotation: number;
  startX: number;
  startY: number;
};

function clampRotation(rotation: number) {
  return Math.min(180, Math.max(0, rotation));
}

export function HeroBusinessCard() {
  const [side, setSide] = useState<"front" | "back">("front");
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pointerGesture = useRef<PointerGesture | null>(null);
  const didDrag = useRef(false);

  const setSettledSide = (nextSide: "front" | "back") => {
    setSide(nextSide);
    setRotation(nextSide === "back" ? 180 : 0);
  };

  const suppressNextClick = () => {
    didDrag.current = true;
    window.setTimeout(() => {
      didDrag.current = false;
    }, 0);
  };

  const releasePointer = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const finishGesture = (event: PointerEvent<HTMLButtonElement>) => {
    const gesture = pointerGesture.current;

    if (!gesture || gesture.pointerId !== event.pointerId) return;

    releasePointer(event);
    pointerGesture.current = null;

    if (gesture.axis === "horizontal") {
      setSettledSide(
        gesture.latestRotation >= SNAP_MIDPOINT_DEGREES ? "back" : "front",
      );
      setIsDragging(false);
      suppressNextClick();
      return;
    }

    if (gesture.axis === "vertical") {
      suppressNextClick();
    }
  };

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
        className="cta-focus relative block aspect-[25/14] w-full touch-pan-y select-none bg-transparent text-left transition-transform duration-[650ms] ease-[cubic-bezier(.22,1,.36,1)] [transform-style:preserve-3d] motion-reduce:transition-none"
        onDragStart={(event) => event.preventDefault()}
        style={{
          transform: `rotateY(${rotation}deg)`,
          transition: isDragging ? "none" : undefined,
        }}
        onClick={() => {
          if (didDrag.current) {
            didDrag.current = false;
            return;
          }
          setSettledSide(side === "front" ? "back" : "front");
        }}
        onPointerDown={(event) => {
          if (
            !event.isPrimary ||
            (event.pointerType === "mouse" && event.button !== 0)
          ) {
            return;
          }

          pointerGesture.current = {
            axis: null,
            cardWidth: event.currentTarget.getBoundingClientRect().width,
            latestRotation: rotation,
            pointerId: event.pointerId,
            startRotation: rotation,
            startX: event.clientX,
            startY: event.clientY,
          };
          didDrag.current = false;
        }}
        onPointerMove={(event) => {
          const gesture = pointerGesture.current;

          if (!gesture || gesture.pointerId !== event.pointerId) return;

          const horizontalTravel = event.clientX - gesture.startX;
          const verticalTravel = event.clientY - gesture.startY;

          if (gesture.axis === null) {
            if (
              Math.max(Math.abs(horizontalTravel), Math.abs(verticalTravel)) <=
              DRAG_ACTIVATION_PX
            ) {
              return;
            }

            gesture.axis =
              Math.abs(horizontalTravel) > Math.abs(verticalTravel)
                ? "horizontal"
                : "vertical";

            if (gesture.axis === "horizontal") {
              event.currentTarget.setPointerCapture(event.pointerId);
              setIsDragging(true);
            }
          }

          if (gesture.axis !== "horizontal") return;

          const nextRotation = clampRotation(
            gesture.startRotation -
              (horizontalTravel / gesture.cardWidth) * 180,
          );
          gesture.latestRotation = nextRotation;
          setRotation(nextRotation);
        }}
        onPointerUp={finishGesture}
        onPointerCancel={finishGesture}
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
      <span
        data-testid="hero-card-flip-cue"
        aria-hidden
        className="pointer-events-none absolute -bottom-9 right-1 flex rotate-[6deg] items-center gap-2 font-heading text-sm italic text-accent-orange sm:-right-8 sm:text-base"
      >
        <svg viewBox="0 0 42 22" className="h-5 w-10" fill="none">
          <path
            d="M2 18C12 3 27 3 37 13M31 12l7 1-2-7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Flip
      </span>
      <p id="hero-card-instructions" className="sr-only">
        Drag, tap, or press Enter or Space to turn the card.
      </p>
    </div>
  );
}
