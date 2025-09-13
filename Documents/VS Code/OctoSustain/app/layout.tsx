import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Suspense } from "react";
import UserProvider from "@/hooks/user-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OctoSustain - Real-Time Eco-Collaboration Platform",
  description:
    "Track your eco-impact with OctoPods. Multitask like an octopus and save the planet!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <UserProvider>
        <body
          className={`font-sans ${inter.variable} antialiased min-h-screen eco-gradient dark:eco-gradient-dark`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-screen">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              }
            >
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </Suspense>
          </ThemeProvider>
          <Analytics />
        </body>
      </UserProvider>
    </html>
  );
}
