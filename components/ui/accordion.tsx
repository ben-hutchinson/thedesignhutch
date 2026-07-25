"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type AccordionItem = {
  id: string;
  question: string;
  answer: string;
};

type AccordionProps = {
  items: AccordionItem[];
  theme?: "paper" | "dark";
};

export function Accordion({ items, theme = "paper" }: AccordionProps) {
  const [activeId, setActiveId] = useState<string>("");

  return (
    <div
      className={cn(
        "border-t",
        theme === "dark" ? "border-white/35" : "border-[#181a17]",
      )}
    >
      {items.map((item) => {
        const isOpen = item.id === activeId;

        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden border-b transition duration-300",
              theme === "dark" ? "border-white/30" : "border-[#181a17]/45",
              isOpen
                ? "bg-[#3453d1] text-white"
                : theme === "dark"
                  ? "bg-transparent hover:bg-white/[.04]"
                  : "bg-transparent hover:bg-[#f8f5ed]/50",
            )}
          >
            <h2>
              <button
                type="button"
                className={cn(
                  "cta-focus flex w-full items-center justify-between gap-6 px-3 text-left font-body text-lg",
                  theme === "dark" ? "py-3.5" : "py-5",
                  isOpen || theme === "dark" ? "text-white" : "text-[#181a17]",
                )}
                aria-expanded={isOpen}
                aria-controls={`${item.id}-panel`}
                id={`${item.id}-trigger`}
                onClick={() => setActiveId(isOpen ? "" : item.id)}
              >
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className={cn(
                    "font-body text-xl transition-transform duration-300",
                    isOpen
                      ? "rotate-45 text-accent-orange"
                      : "rotate-0 text-accent-blue",
                  )}
                >
                  +
                </span>
              </button>
            </h2>
            {isOpen ? (
              <div
                id={`${item.id}-panel`}
                role="region"
                aria-labelledby={`${item.id}-trigger`}
                className="grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-300"
              >
                <div className="overflow-hidden">
                  <p
                    className={cn(
                      "px-3 pb-6 text-sm leading-relaxed",
                      isOpen ? "text-white/80" : "text-[#55564f]",
                    )}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
