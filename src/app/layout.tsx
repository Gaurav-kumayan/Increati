import type { Metadata } from "next";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from '@clerk/themes';
import ThemeProvider from "@/components/ThemeProvider";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Increati - Connect, Collaborate, Create",
  description: "Increati connects like-minded individuals, enabling seamless collaboration, knowledge sharing, and event organization—from nearby communities to a global audience.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let currentTheme:"dark"|"light"|undefined=undefined;
  const theme=(await cookies()).get("theme")?.value;
  if(theme=="dark" || theme=="light")
    currentTheme=theme;
  return (

    <ClerkProvider
    appearance={{
      baseTheme: currentTheme=="dark"? dark : neobrutalism
    }}
    >
      <html lang="en" className={currentTheme}>
  <body
    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
  >
    <ThemeProvider theme={currentTheme}></ThemeProvider>
    {children}
  </body>
</html>
    </ClerkProvider>
  );
}
