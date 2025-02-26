import { RegisterForm } from "@/components/register-form"
import RegisterNavbar from "@/components/Navbar/RegisterNavbar"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import { Niche, NicheCategory } from "@/types/Niche";
import { Country } from "@/types/Country";
import { Toaster } from "@/components/ui/sonner";

export default async function LoginPage() {

  const { userId } = await auth();
    if (!userId) return redirect("/sign-in");
    let userExistsInDB=true, nicheCategories:NicheCategory[]=[], niches:Niche[]=[], countries:Country[]=[];
    try {
      // Check if user exists in PostgreSQL
      const { rowCount } = await pool.query("SELECT 1 FROM users WHERE id = $1", [userId]);
  
      // Redirect if user is not found
      if (rowCount === 0) 
      {
        userExistsInDB=false;
        nicheCategories = (await pool.query("SELECT * FROM niche_category;")).rows;
        niches = (await pool.query("SELECT * FROM niche;")).rows;
        countries=(await pool.query("SELECT * FROM countries;")).rows;
      }
    } catch (error) {
      console.error("Database error:", error);
      return redirect("/error"); // Redirect to an error page if the query fails
    }
    if(userExistsInDB) return redirect("/"); // Redirect to sign-up if user is not found
  return (
    <>
    <RegisterNavbar />
    <Toaster swipeDirections={["left","right","top"]} />
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <RegisterForm nicheCategories={nicheCategories} niches={niches} countries={countries} />
      </div>
    </div>
    </>
  )
}
