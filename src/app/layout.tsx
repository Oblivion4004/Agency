import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { Header, Footer } from "@/components/shell";
export const metadata: Metadata = {
  title: {
    default: "ATRIXX — Digital experiences, beyond ordinary.",
    template: "%s — ATRIXX",
  },
  description:
    "Independent creative development studio. Distinctive websites, immersive 3D experiences, and thoughtful digital products.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "ATRIXX — Beyond ordinary.",
    description:
      "Distinctive websites. Immersive experiences. Built with intention.",
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
    <html lang="en">
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
