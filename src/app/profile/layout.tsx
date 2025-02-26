import { auth, clerkClient } from "@clerk/nextjs/server";
import { Metadata } from "next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    children
  );
}

export async function generateMetadata(): Promise<Metadata> {
    const { userId } = await auth();
    if (!userId) {
      return {
        title: 'Increati Profile Page',
        description: 'Manage your profile, showcase your expertise, and connect with others.',
      }
    }
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return {
      title: `${user.fullName} (@${user.username})`,
      description: 'Manage your profile, showcase your expertise, and connect with others.',
    }
  }
