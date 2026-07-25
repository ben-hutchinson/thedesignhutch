import Image from "next/image";

import { cn } from "@/lib/utils";

type LogoMarkProps = {
  className?: string;
  imageClassName?: string;
  withBackground?: boolean;
};

export function LogoMark({ className, imageClassName }: LogoMarkProps) {
  return (
    <span
      className={cn(
        "relative inline-flex aspect-[338/293] shrink-0",
        className,
      )}
      aria-hidden
    >
      <Image
        src="/brand/design-hutch-logo-mark-transparent.png"
        alt=""
        fill
        unoptimized
        data-brand-mark="official"
        sizes="(min-width: 768px) 120px, 72px"
        className={cn(
          "object-contain brightness-[3.5] grayscale",
          imageClassName,
        )}
      />
    </span>
  );
}

type BrandLockupProps = {
  compact?: boolean;
  className?: string;
  markClassName?: string;
};

export function BrandLockup({
  compact = false,
  className,
  markClassName,
}: BrandLockupProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-3 text-current", className)}
    >
      <LogoMark
        className={cn(
          compact ? "h-9 w-[2.65rem]" : "h-11 w-[3.2rem]",
          markClassName,
        )}
      />
      {compact ? (
        <span className="sr-only">The Design Hutch</span>
      ) : (
        <span className="font-body text-[1.35rem] font-medium leading-none tracking-[-.04em] sm:text-[1.65rem]">
          The Design Hutch
        </span>
      )}
    </span>
  );
}
