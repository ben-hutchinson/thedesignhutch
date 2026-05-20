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
};

export function Accordion({ items }: AccordionProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = item.id === activeId;

        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden rounded-2xl border bg-white/[0.03] transition duration-300",
              isOpen
                ? "border-accent-blue/35 bg-accent-blue/[0.06]"
                : "border-white/10 hover:border-white/20 hover:bg-white/[0.05]",
            )}
          >
            <h3>
              <button
                type="button"
                className="cta-focus flex w-full items-center justify-between gap-6 px-5 py-4 text-left text-base font-medium text-white"
                aria-expanded={isOpen}
                aria-controls={`${item.id}-panel`}
                id={`${item.id}-trigger`}
                onClick={() => setActiveId(isOpen ? "" : item.id)}
              >
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className={cn(
                    "text-xl text-zinc-400 transition-transform duration-300",
                    isOpen ? "rotate-45 text-accent-orange" : "rotate-0",
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            {isOpen ? (
              <div
                id={`${item.id}-panel`}
                role="region"
                aria-labelledby={`${item.id}-trigger`}
                className="grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-300"
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-300">
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
