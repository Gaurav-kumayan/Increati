"use client";
import Link from "next/link"
import { Home, Search, Bell, MessageCircleMore } from "lucide-react"
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { FaBell, FaHouseChimney } from "react-icons/fa6";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { usePathname } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import UserDropdown from "../UserDropdown";
import ThemeChangeButton from "../ui/ThemeChangeButton";

export default function Navbar() {
  const {isLoaded}=useUser();
  const pathname=usePathname();
  const [theme, setTheme] = useState<"light"|"dark"|undefined>(undefined);

    useEffect(() => {
    if(theme==undefined){
        const localTheme=localStorage.getItem("theme");
        if(localTheme==null){
            const isDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(isDark?"dark":"light");
        }
        else{
            setTheme(localTheme as "light"|"dark");
        }
        return;
    }
    localStorage.setItem("theme",theme);
    document.documentElement.classList.add(theme);
    document.documentElement.classList.remove(theme=="dark"?"light":"dark");
    axios.get(`/api/set-theme?theme=${theme}`);
    },[theme]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
          const searchInput = document.getElementById("main_search");
      
          // If an input or textarea is focused, do nothing
          if (document.activeElement === searchInput) return;
      
          // Focus on the search bar when `/` is pressed (and prevent default action)
          if (e.key === "/") {
            e.preventDefault();
            searchInput?.focus();
          }
      
          // Focus on the search bar when `Ctrl + K` is pressed (and prevent default action)
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            searchInput?.focus();
          }
        };
      
        window.addEventListener("keydown", handleKeyPress);
        return () => {
          window.removeEventListener("keydown", handleKeyPress);
        };
      }, []);
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-background border-b h-14">
        <div className="flex items-center justify-between max-w-[1280px] mx-auto px-2 sm:px-6 md:px-8 lg:px-10 h-full">
            <div className="flex items-center w-full sm:gap-12 md:gap-8 gap-2 md:me-6">
          <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
        <Image src="/logo.png" alt="Increati" width={72} height={72} />
      </Link>
          </div>
          
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  id="main_search"
                  type="search"
                  placeholder="Search..."
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`max-w-xl h-9 rounded-md border border-input pl-10 text-sm 
                      focus:border-foreground dark:focus:border-primary bg-secondary focus:bg-background focus:outline-none 
                      ${isSearchFocused ? 'w-full' : 'sm:w-[280px]'}
                      transition-all duration-300 ease-in-out`}
              />
            </div>
        </div>
          <div className="flex items-center space-x-4 w-auto h-full">
            <div className="flex items-center h-full gap-4">
                  <div className="grid md:grid-cols-3 grid-cols-1 h-full lg:w-64 md:w-40 w-8 md:ms-0 ms-3 me-1 md:me-0">
            <Link 
              href="/" 
              className={`hidden md:flex h-full justify-center flex-col items-center text-xs font-medium ${pathname=="/"? "text-foreground dark:text-primary border-b-2 border-foreground dark:border-primary":"text-muted-foreground hover:text-foreground dark:hover:text-primary"}`}
              prefetch={false}
            >
              {pathname=="/"? <FaHouseChimney className="h-6 w-6" />:<Home className="h-6 w-6" />}
            </Link>
            <Link 
              href="/notifications" 
              className={`hidden md:flex h-full justify-center flex-col items-center text-xs font-medium dark:hover:text-primary ${pathname=="/notifications"? "text-foreground dark:text-primary border-b-2 border-foreground dark:border-primary":"text-muted-foreground hover:text-foreground dark:hover:text-primary"}`}
              prefetch={false}
              >
              {pathname=="/notifications"? <FaBell className="h-6 w-6" />:<Bell className="h-6 w-6" />}
            </Link>
            <Link 
              href="/messages" 
              className={`flex flex-col h-full justify-center items-center text-xs font-medium dark:hover:text-primary ${pathname=="/messages"? "text-foreground dark:text-primary md:border-b-2 md:border-foreground dark:md:border-primary":"text-muted-foreground hover:text-foreground dark:hover:text-primary"}`}
              prefetch={false}
              >
              {pathname=="/messages"? <IoChatbubbleEllipses className="h-6 w-6" />:<MessageCircleMore className="h-6 w-6" />}
            </Link>
                </div>
            <div className="hidden md:flex items-center gap-4">
            <ThemeChangeButton theme={theme} setTheme={setTheme} />
            {isLoaded? <SignedIn><UserButton>
              <UserButton.MenuItems>
                  <UserButton.Link
                      label="Profile"
                      labelIcon={<CgProfile size={"sm"} />}
                      href="/profile"
                      />
              </UserButton.MenuItems>
          </UserButton></SignedIn>: <Skeleton className="h-6 w-6 rounded-full" />}
              <SignedOut>
          <div className="flex items-center justify-center gap-4">
            <SignInButton><Button variant={"outline"} className="border-2 border-foreground dark:border-primary bg-transparent rounded-lg hover:bg-foreground dark:hover:bg-primary hover:text-background transition-all duration-200">Sign In</Button></SignInButton>
          </div>
        </SignedOut>
          </div>
        </div>

            
          </div>
        </div>
      </header>

      <div className="md:hidden fixed bottom-0 left-0 z-10 flex w-full items-center justify-around bg-background border-t pb-5 pt-3">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          prefetch={false}
        >
          {pathname=="/"? <FaHouseChimney className="h-6 w-6 text-foreground dark:text-primary" />:<Home className="h-6 w-6 text-muted-foreground hover:text-foreground dark:hover:text-primary" />}
        </Link>
        <Link
          href="/notifications"
          className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          prefetch={false}
        >
          {pathname=="/notifications"? <FaBell className="h-6 w-6 text-foreground dark:text-primary" />:<Bell className="h-6 w-6 text-muted-foreground hover:text-foreground dark:hover:text-primary" />}
        </Link>
        {isLoaded? <SignedIn><UserButton>
              <UserButton.MenuItems>
                  <UserButton.Link
                      label="Profile"
                      labelIcon={<CgProfile size={"sm"} />}
                      href="/profile"
                      />
              </UserButton.MenuItems>
          </UserButton></SignedIn>: <Skeleton className="h-6 w-6 rounded-full" />}
        <SignedOut>
          <UserDropdown theme={theme} setTheme={setTheme} />
        </SignedOut>
      </div>
    </>
  )
}