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
  "cta-focus relative isolate inline-flex items-center justify-center overflow-hidden rounded-full font-semibold tracking-[0.01em] transition-[transform,box-shadow,border-color,background-color,color,filter] duration-300 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-accent-blue to-accent-orange px-6 text-white shadow-glow before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)] before:translate-x-[-140%] before:transition-transform before:duration-700 hover:brightness-110 hover:shadow-glow-orange hover:before:translate-x-[140%]",
  secondary:
    "border border-white/15 bg-white/[0.04] text-white hover:border-white/35 hover:bg-white/[0.1] hover:shadow-[0_16px_35px_-25px_rgba(255,255,255,0.6)]",
  ghost: "text-zinc-300 hover:text-white",
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
