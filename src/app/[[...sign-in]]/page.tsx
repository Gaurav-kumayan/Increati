import Navbar from "@/components/Navbar/Navbar";
import { pool } from "@/lib/db";
import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";

async function getUserStatus() {
  const { userId } = await auth();
  if (!userId) return { userId: null, userExistsInDB: false };

  try {
    const { rowCount } = await pool.query("SELECT 1 FROM users WHERE id = $1", [userId]);
    return { userId, userExistsInDB: rowCount !== 0 };
  } catch (error) {
    console.error("Database error:", error);
    return { userId, userExistsInDB: false, error: true };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { userId, userExistsInDB, error } = await getUserStatus();

  if (error) {
    return { title: "Error | Increati", description: "An error occurred while processing your request." };
  }
  if (!userId) {
    return { title: "Increati - Connect, Collaborate, Create", description: "Increati connects like-minded individuals, enabling seamless collaboration, knowledge sharing, and event organization—from nearby communities to a global audience." };
  }
  if (!userExistsInDB) {
    return { title: "Register | Increati", description: "Fill up the details to create your account and get started." };
  }
  
  return { title: "Home | Increati", description: "Welcome to Increati – your go-to platform for creativity, innovation, and digital solutions. Explore insightful content, cutting-edge technology, and expert-driven ideas to bring your vision to life." };
}

export default async function Home() {
  const { userId, userExistsInDB, error } = await getUserStatus();

  if (error) return redirect("/error");
  if (!userId) return (
    <div className="flex items-center justify-center min-h-screen py-2">
      <SignIn />
    </div>
  );
  if (!userExistsInDB) return redirect("/register");

  return <Navbar pathname="/" />;
}
