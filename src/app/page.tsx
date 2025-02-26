import Navbar from "@/components/Navbar/Navbar";
import { pool } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  // Authenticate user with Clerk
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");
  let userExistsInDB=true;
  try {
    // Check if user exists in PostgreSQL
    const { rowCount } = await pool.query("SELECT 1 FROM users WHERE id = $1", [userId]);

    // Redirect if user is not found
    if (rowCount === 0) userExistsInDB=false;
  } catch (error) {
    console.error("Database error:", error);
    return redirect("/error"); // Redirect to an error page if the query fails
  }
  if(!userExistsInDB) return redirect("/register"); // Redirect to sign-up if user is not found

  return <Navbar />;
}
