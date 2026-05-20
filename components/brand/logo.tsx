import Image from "next/image";

import { cn } from "@/lib/utils";

const logoPaths = {
  full: "/brand/design-hutch-logo-full.png",
  icon: "/brand/design-hutch-logo-icon.png",
} as const;

type LogoMarkProps = {
  className?: string;
  imageClassName?: string;
  withBackground?: boolean;
};

export function LogoMark({ className, imageClassName }: LogoMarkProps) {
  return (
    <span
      className={cn(
        "relative inline-flex aspect-square shrink-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      <Image
        src={logoPaths.icon}
        alt=""
        fill
        sizes="64px"
        className={cn("object-cover", imageClassName)}
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
  if (compact) {
    return (
      <span className={cn("inline-flex items-center", className)}>
        <LogoMark className={cn("h-10 w-10", markClassName)} />
        <span className="sr-only">The Design Hutch</span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={logoPaths.full}
        alt="The Design Hutch"
        width={1600}
        height={896}
        priority
        className={cn("h-auto w-52 sm:w-60", markClassName)}
      />
    </span>
  );
}
