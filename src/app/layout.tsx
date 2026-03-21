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
  title: "Hederon AI – Your AI Executive Team",
  description:
    "Run a company of one — powered by intelligent agents and Hedera. Hederon AI gives you a CEO, Strategy, Marketing, and Operations agent to execute any goal.",
  keywords: ["AI agents", "executive team", "Hedera", "productivity", "automation", "Hederon AI"],
  openGraph: {
    title: "Hederon AI – Your AI Executive Team",
    description: "Multi-agent AI system powered by Hedera blockchain",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
