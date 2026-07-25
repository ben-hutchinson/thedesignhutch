import { cn } from "@/lib/utils";

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 28 16"
      className={cn("h-4 w-7 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth="1.4"
    >
      <path d="M1 8h24M19 2l6 6-6 6" />
    </svg>
  );
}
