import type { Metadata } from "next";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import Notch from "@/components/Notch";
import ThemeSelect from "@/components/ThemeSelect";
import { ThemeSelectProvider } from "@/contexts/ThemeSelectContext";

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
        <ThemeSelectProvider>
          <Notch />
          <div className="relative flex w-screen h-[calc(100vh-100px)] mt-[100px]">
            <ThemeSelect />
            {children}
          </div>
        </ThemeSelectProvider>
      </body>
    </html>
  );
}
