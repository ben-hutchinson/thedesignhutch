"use client";

import Link, { type LinkProps } from "next/link";
import { type ComponentPropsWithoutRef, type MouseEvent } from "react";

import { type CtaId, type CtaSource, trackCtaClick } from "@/lib/analytics";

type TrackingMeta = {
  ctaId: CtaId;
  source: CtaSource;
  destination: string;
};

type TrackedLinkProps = LinkProps &
  Omit<ComponentPropsWithoutRef<"a">, "href"> & {
    tracking: TrackingMeta;
  };

export function TrackedLink({
  tracking,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackCtaClick(tracking);
    onClick?.(event);
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}

type TrackedAnchorProps = ComponentPropsWithoutRef<"a"> & {
  tracking: TrackingMeta;
};

export function TrackedAnchor({
  tracking,
  onClick,
  children,
  ...props
}: TrackedAnchorProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackCtaClick(tracking);
    onClick?.(event);
  };

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
