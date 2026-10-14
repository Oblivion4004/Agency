import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import "./arcade.css";
import "./coffee-theme.css";
import { Header, Footer } from "@/components/shell";
export const metadata: Metadata = {
  title: {
    default: "Arvion Studios — Small business. Big website energy.",
    template: "%s — Arvion Studios",
  },
  description:
    "Premium custom websites for cafés, shops, salons, and local services. Designed and developed by Atharva.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Arvion Studios — Level up your business online.",
    description:
      "Everyday businesses. Extraordinary websites. Custom design and development by Atharva.",
    type: "website",
  },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { themeColor: "#10110f" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body id="top">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
