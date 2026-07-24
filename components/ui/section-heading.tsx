import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  level?: "h1" | "h2";
} & HTMLAttributes<HTMLDivElement>;

export function SectionHeading({
  eyebrow,
  title,
  description,
  level = "h2",
  className,
  ...props
}: SectionHeadingProps) {
  const Heading = level;

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <p className="section-subtitle">{eyebrow}</p>
      <Heading className="section-title">{title}</Heading>
      {description ? (
        <p className="body-lead max-w-[var(--content-max-readable)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
