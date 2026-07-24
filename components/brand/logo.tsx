import { cn } from "@/lib/utils";

type LogoMarkProps = {
  className?: string;
  imageClassName?: string;
  withBackground?: boolean;
};

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <span
      className={cn("inline-flex aspect-square shrink-0", className)}
      aria-hidden
    >
      <svg
        viewBox="0 0 96 96"
        className="h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M12 80h72M18 42 48 20l30 22M23 41v39m50-39v39M37 79V43h12v17h14V43h10"
          strokeWidth="3"
        />
        <path
          d="M77 80c0-13 4-24 12-32-1 15-4 26-12 32Zm1 0c5-5 10-8 15-10"
          strokeWidth="2.6"
        />
        <path d="M18 30h60" strokeWidth="1" opacity=".45" />
      </svg>
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
        className={cn(compact ? "h-10 w-10" : "h-12 w-12", markClassName)}
      />
      {compact ? (
        <span className="sr-only">The Design Hutch</span>
      ) : (
        <span className="font-heading text-2xl leading-none sm:text-3xl">
          The Design Hutch
        </span>
      )}
    </span>
  );
}
