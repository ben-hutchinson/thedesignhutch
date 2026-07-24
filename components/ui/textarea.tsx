import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full resize-y rounded-none border border-[#aaa99f] bg-[#f8f5ed] px-4 py-3 text-sm text-[#181a17] placeholder:text-[#77766f] focus-visible:border-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
