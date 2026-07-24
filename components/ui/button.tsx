import { type ButtonHTMLAttributes, type PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  }
>;

const baseStyles =
  "cta-focus relative isolate inline-flex items-center justify-center overflow-hidden rounded-none border font-semibold uppercase tracking-[0.1em] transition-[transform,box-shadow,border-color,background-color,color] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-accent-blue bg-accent-blue px-6 text-white shadow-glow hover:-translate-y-0.5 hover:border-[#243da8] hover:bg-[#243da8]",
  secondary:
    "border-current bg-transparent text-current hover:-translate-y-0.5 hover:bg-current/5",
  ghost: "border-transparent text-current hover:border-current/30",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm sm:h-[3.15rem] sm:px-7",
};

type ButtonStylesOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStylesOptions = {}) {
  return cn(baseStyles, variants[variant], sizes[size], className);
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonStyles({ variant, size, className })} {...props}>
      <span className="relative z-[1]">{children}</span>
    </button>
  );
}
