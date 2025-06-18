import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Notch from "@/components/Notch";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MA's Portfolio",
  description: "I and Work",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body>
        <Notch />

        {children}
      </body>
    </html>
  );
}
