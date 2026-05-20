import Script from "next/script";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export function AnalyticsScript() {
  if (!gaId) {
    return (
      <Script id="analytics-datalayer-init" strategy="afterInteractive">
        {"window.dataLayer = window.dataLayer || [];"}
      </Script>
    );
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="analytics-ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
