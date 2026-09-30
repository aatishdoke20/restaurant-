import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://khaana.in"),
  title: "Khaana — Contemporary Indian Cuisine · Pune",
  description:
    "India, reimagined. Khaana is a contemporary Indian restaurant in Koregaon Park, Pune — rooted in tradition, curated for today.",
  openGraph: {
    title: "Khaana — India, Reimagined.",
    description: "A culinary journey through India's boldest flavours. Koregaon Park, Pune.",
    images: ["/images/hero/hero-dish.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#090806",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>
        <Script id="khaana-js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add('js')`}
        </Script>
        {children}
      </body>
    </html>
  );
}
