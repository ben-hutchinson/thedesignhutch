import Script from "next/script";

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const validGaId = gaId && /^G-[A-Z0-9]+$/.test(gaId) ? gaId : null;

export function AnalyticsScript() {
  if (!validGaId) {
    return (
      <Script id="analytics-datalayer-init" strategy="afterInteractive">
        {"window.dataLayer = window.dataLayer || [];"}
      </Script>
    );
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${validGaId}`}
        strategy="afterInteractive"
      />
      <Script id="analytics-ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${validGaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
