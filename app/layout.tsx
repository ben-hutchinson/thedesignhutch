import type { Metadata, Viewport } from "next";
import { type ReactNode } from "react";

import { AnalyticsScript } from "@/components/analytics/analytics-script";
import { siteConfig } from "@/lib/constants";

import "@fontsource-variable/manrope";
import "@fontsource-variable/space-grotesk";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  title: {
    default: "The Design Hutch | Premium Websites for Local Businesses",
    template: "%s | The Design Hutch",
  },
  description: siteConfig.description,
  openGraph: {
    title: "The Design Hutch",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "The Design Hutch premium web design studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Design Hutch",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: "/",
  },
  category: "web design",
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-base-950 font-body text-white antialiased">
        <AnalyticsScript />
        {children}
      </body>
    </html>
  );
}
