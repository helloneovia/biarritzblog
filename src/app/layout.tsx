import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/Analytics";
import { Providers } from "@/components/auth/Providers";
import { SupportWidget } from "@/components/layout/SupportWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Biarritz | Premium Orthopaedic Insoles",
  description: "Experience ultimate comfort and pain relief with Biarritz orthopaedic insoles. Designed for posture correction, foot support, and all-day comfort. Shop now!",
  openGraph: {
    title: "Biarritz | Premium Orthopaedic Insoles",
    description: "Experience ultimate comfort and pain relief with Biarritz orthopaedic insoles.",
    url: "https://steppprs.com",
    siteName: "Biarritz",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased selection:bg-primary selection:text-primary-foreground`}>
        <Providers>
          <form style={{ display: 'none' }} /> {/* Temp fix for some next.js hydration quirks */}
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <SupportWidget />
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
