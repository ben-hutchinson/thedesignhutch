import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
} & HTMLAttributes<HTMLDivElement>;

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <p className="section-subtitle">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description ? (
        <p className="body-lead max-w-[var(--content-max-readable)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
