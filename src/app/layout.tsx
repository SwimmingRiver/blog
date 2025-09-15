import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "my blog",
  description: "dev-log",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        >
          <Header />
          <main className="py-10 max-w-3xl mx-auto px-4">{children}</main>
          <Footer />
        </body>
      </html>
    </QueryProvider>
  );
}
