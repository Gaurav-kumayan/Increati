import { Metadata } from "next";

export const metadata:Metadata={
    title:"Notifications | Increati",
    description: "View your notifications"
} 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    children
  );
}