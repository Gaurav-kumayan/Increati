import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Get the theme from query parameters (?theme=dark)
  const { searchParams } = new URL(req.url);
  const theme = searchParams.get("theme");

  if (!theme || (theme !== "light" && theme !== "dark")) {
    return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
  }

  // Set the theme in a cookie (expires in 30 days)
  const response = NextResponse.json({ message: "Theme set successfully", theme });
  response.cookies.set("theme", theme, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 365 * 24 * 60 * 60, // 30 days
    path: "/",
  });

  return response;
}