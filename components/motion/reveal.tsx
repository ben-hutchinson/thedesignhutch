import { type ReactNode } from "react";

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}) {
  return (
    <div className={`workshop-reveal ${className ?? ""}`} data-reveal>
      {children}
    </div>
  );
}
