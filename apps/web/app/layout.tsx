import type { Metadata, Viewport } from "next";
import "@/theme/theme.css";
import "./globals.css";
import "./studio.css";
import "./tap-highlight.css";
import "./ux.css";

export const metadata: Metadata = {
  title: {
    default: "Vraunix Studio — Building Your Digital Future.",
    template: "%s — Vraunix Studio",
  },
  description:
    "Vraunix Studio designs and builds modern, responsive websites, digital experiences, and custom web solutions for businesses.",
  applicationName: "Vraunix Studio",
  authors: [{ name: "Vraunix Studio" }],
  creator: "Vraunix Studio",
  openGraph: {
    title: "Vraunix Studio — Building Your Digital Future.",
    description:
      "Thoughtful websites and digital systems, built with clear scope and honest communication.",
    type: "website",
    siteName: "Vraunix Studio",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1311",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
