import { SiteConfig } from "@/types/siteConfig";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.sbtitest.com";

export const siteConfig: SiteConfig = {
  name: "SBTI",
  tagLine: "SBTI Multilingual Site",
  description:
    "A multilingual SBTI site with blog and basic SEO infrastructure.",
  url: BASE_URL,
  authors: [
    {
      name: "SBTI",
      url: BASE_URL,
    },
  ],
  creator: "SBTI",
  socialLinks: {},
  themeColors: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  defaultNextTheme: "system", // next-theme option: system | dark | light
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png", // apple-touch-icon.png
  },
};
