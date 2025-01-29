import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons: {
    apple: [
      "/apple-icon-57x57.png",
      "/apple-icon-60x60.png",
      "/apple-icon-72x72.png",
      "/apple-icon-76x76.png",
      "/apple-icon-114x114.png",
      "/apple-icon-120x120.png",
      "/apple-icon-144x144.png",
      "/apple-icon-152x152.png",
      "/apple-icon-180x180.png"
    ],
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon-96x96.png", sizes: "96x96" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
      { url: "/android-icon-192x192.png", sizes: "192x192" }
    ],
    other: [
      { rel: "msapplication-TileImage", url: "/ms-icon-144x144.png" },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: dark
    }}
    >
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
