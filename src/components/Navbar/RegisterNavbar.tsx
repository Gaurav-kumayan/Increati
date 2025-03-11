"use client";
import Link from "next/link"
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import ThemeChangeButton from "../ui/ThemeChangeButton";

export default function RegisterNavbar() {
  const [theme, setTheme] = useState<"light"|"dark"|undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(()=>{
    setMounted(true);
  },[]);

    useEffect(() => {
      if(!mounted) return;
    const localTheme=localStorage.getItem("theme");
    if(theme==undefined){
        if(localTheme==null){
            const isDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(isDark?"dark":"light");
        }
        else{
            setTheme(localTheme as "light"|"dark");
        }
        return;
    }
    if(localTheme==theme) return;
    localStorage.setItem("theme",theme);
    document.documentElement.classList.add(theme);
    document.documentElement.classList.remove(theme=="dark"?"light":"dark");
    axios.get(`/api/set-theme?theme=${theme}`);
    },[theme,mounted]);
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
        </div>
          <div className="flex items-center space-x-4 w-auto h-full">
            <div className="flex items-center h-full gap-4">
            <div className="hidden md:flex items-center gap-4">
            
          </div>
        </div>
        <ThemeChangeButton />
        <SignOutButton><Button variant={"outline"} className="border-2 border-foreground dark:border-primary bg-transparent rounded-lg hover:bg-foreground dark:hover:bg-primary hover:text-background transition-all duration-200">Sign Out</Button></SignOutButton>
            
          </div>
        </div>
      </header>
    </>
  )
}