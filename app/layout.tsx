import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import { ClientProviders } from "./providers/ClientProviders";
import { ClerkClientProvider } from "./providers/ClerkClientProvider";

import ClerkPreload from "./components/ClerkPreload";
import { Analytics } from '@vercel/analytics/react';
import PageWrapper from "./page-wrapper";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mistral = localFont({
  src: "./fonts/mistral.ttf",
  variable: "--font-mistral",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StreeSilk | Authentic Assamese Silk",
  description: "Discover the elegance of genuine Muga, Pat, and Eri silk. Handcrafted tradition meets modern sophistication.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'oklch(0.141 0.005 285.823)' },
    { media: '(prefers-color-scheme: dark)', color: 'oklch(1 0 0)' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <head>
        {/* Critical CSS applied immediately */}
        <style>{`
          html, body { 
            margin: 0; 
            padding: 0; 
            background-color: var(--background); 
            color: var(--foreground);
          }
          
          /* Force light theme for no-js users */
          body:not(:has(script)) {
            background-color: oklch(1 0 0) !important;
            color: oklch(0.141 0.005 285.823) !important;
          }
        `}</style>
      </head>
      <body
        suppressHydrationWarning
        className={`${geistMono.variable} ${montserrat.variable} ${mistral.variable} antialiased min-h-screen flex flex-col bg-background`}
      >
        <ClerkClientProvider>
          <ClientProviders>
            <LoadingScreen />
            <ClerkPreload />
            <div id="content-wrapper" className="flex min-h-screen flex-col bg-background">
              <Navbar />
              <main className="flex-1">
                <PageWrapper>
                  {children}
                </PageWrapper>
              </main>
              <Footer />
            </div>
            <Analytics />
          </ClientProviders>
        </ClerkClientProvider>
      </body>
    </html>
  );
}
