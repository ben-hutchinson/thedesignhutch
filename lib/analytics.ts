export type FunnelEventName =
  | "cta_click"
  | "contact_form_submit"
  | "contact_form_success"
  | "contact_form_error"
  | "funnel_depth_reached"
  | "funnel_section_view";

export type CtaSource =
  | "hero"
  | "navbar"
  | "mobile_sticky"
  | "services"
  | "portfolio"
  | "process"
  | "faq"
  | "contact"
  | "footer";

export type CtaId =
  | "hero_primary"
  | "hero_secondary"
  | "navbar_primary"
  | "navbar_mobile_primary"
  | "mobile_sticky_enquiry"
  | "mobile_sticky_book_call"
  | "services_custom_scope"
  | "portfolio_discuss"
  | "portfolio_visit_live_site"
  | "portfolio_walkthrough"
  | "process_consultation"
  | "faq_email"
  | "faq_enquiry"
  | "contact_submit"
  | "contact_email"
  | "contact_calendly_popup"
  | "contact_calendly_external"
  | "footer_email";

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

type GtagFn = (
  command: "event",
  eventName: string,
  params?: Record<string, string | number | boolean>,
) => void;

function cleanPayload(payload: AnalyticsPayload = {}) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number | boolean>;
}

export function trackEvent(
  event: FunnelEventName,
  payload: AnalyticsPayload = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  const sanitizedPayload = cleanPayload(payload);
  const eventPayload = {
    event,
    ...sanitizedPayload,
    event_timestamp: Date.now(),
  };

  if ("dataLayer" in window) {
    (window as Window & { dataLayer: unknown[] }).dataLayer.push(eventPayload);
  }

  const gtag = (window as Window & { gtag?: GtagFn }).gtag;
  if (typeof gtag === "function") {
    gtag("event", event, sanitizedPayload);
  }
}

export function trackCtaClick({
  ctaId,
  source,
  destination,
}: {
  ctaId: CtaId;
  source: CtaSource;
  destination: string;
}) {
  const path =
    typeof window !== "undefined" ? window.location.pathname : undefined;
  trackEvent("cta_click", {
    cta_id: ctaId,
    cta_source: source,
    cta_destination: destination,
    path,
  });
}
