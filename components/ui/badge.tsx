import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-accent-blue/35 bg-accent-blue/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent-blue",
        className,
      )}
      {...props}
    />
  );
}
