import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/Analytics";
import { Providers } from "@/components/auth/Providers";
import { LazySupportWidget } from "@/components/layout/LazySupportWidget"
import { CartProvider } from "@/lib/store/CartContext"
import { getSiteConfig, getTexts, Locale } from "@/lib/i18n"
import { generateSEOMetadata } from "@/lib/seo-metadata"
import { StructuredData } from "@/components/StructuredData"
import { cookies } from "next/headers"

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "FR") as Locale
  
  const baseMeta = generateSEOMetadata(locale, "home")
  
  return {
    ...baseMeta,
    icons: {
      icon: "/favicon.svg",
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "FR") as Locale
  const config = await getSiteConfig()
  const t = getTexts(config, locale)

  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <StructuredData locale={locale} type="all" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col overflow-x-hidden antialiased selection:bg-primary selection:text-primary-foreground`} suppressHydrationWarning>
        <Providers>
          <form style={{ display: 'none' }} /> {/* Temp fix for some next.js hydration quirks */}
          <CartProvider>
            <AnnouncementBar t={t} />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <LazySupportWidget t={t} />
            <Toaster position="top-center" />
            <Analytics />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
