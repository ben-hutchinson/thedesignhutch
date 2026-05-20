import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionShellProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  withTransition?: boolean;
  children: ReactNode;
};

export function SectionShell({
  id,
  className,
  containerClassName,
  withTransition = true,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "section-shell scroll-mt-24",
        withTransition && "section-transition",
        className,
      )}
    >
      <div className={cn("container-shell", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
