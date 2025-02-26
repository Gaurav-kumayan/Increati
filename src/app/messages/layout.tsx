import { Metadata } from "next";

export const metadata:Metadata={
    title:"Messages | Increati",
    description: "Send and receive messages from other users"
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