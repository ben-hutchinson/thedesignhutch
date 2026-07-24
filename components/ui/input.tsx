import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-none border border-[#aaa99f] bg-[#f8f5ed] px-4 text-sm text-[#181a17] placeholder:text-[#77766f] focus-visible:border-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
