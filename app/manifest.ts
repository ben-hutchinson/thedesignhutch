import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    categories: ["business", "design", "productivity"],
    background_color: siteConfig.themeColor,
    theme_color: siteConfig.themeColor,
    icons: [
      {
        src: siteConfig.logo,
        sizes: "338x293",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
