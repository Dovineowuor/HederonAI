import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" || "https://hederon.dovetecenterprises.site"),
  title: {
    default: "Hederon AI | 24/7 Autonomous Executive Team",
    template: "%s | Hederon AI",
  },
  description:
    "Scale faster with a company of one. Hire specialized autonomous intelligence agents for Strategy, Marketing, and Operations. Verified execution and secure escrow powered by the Hedera ecosystem.",
  keywords: ["AI agents", "autonomous intelligence", "executive team", "Hedera", "blockchain", "productivity", "automation", "HBar", "Hederon AI", "smart contracts", "web3", "AI marketplace"],
  authors: [{ name: "Dovine Owuor", url: "https://hederon.dovetecenterprises.site/" }],
  creator: "Hederon AI",
  publisher: "Hederon AI Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Hederon AI – The Next Generation AI Executive Team",
    description: "Launch your autonomous business powered by specialized AI agents.",
    url: "https://hederon.dovetecenterprises.site/",
    siteName: "Hederon AI Dashboard",
    images: [
      {
        url: "/logo_ilustrated.png",
        width: 1200,
        height: 630,
        alt: "Hederon AI Platform Overview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hederon AI | Your 24/7 Executive Team",
    description: "Hire an autonomous intelligence executive team. Secure escrow and guaranteed handshakes on the Hedera network.",
    images: ["/logo_ilustrated.png"],
    creator: "@HederonAI",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    title: "Hederon AI",
    statusBarStyle: "black-translucent",
    capable: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo_ilustrated.png",
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        {/* Hashgraph Online (HOL) Web Components */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/@hashgraphonline/hashinal-wc/dist/hashinal-wc/hashinal-wc.esm.js" 
          type="module"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full font-sans antialiased bg-black text-white" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
