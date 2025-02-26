"use client";
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Home, Search, Mail, Bell } from "lucide-react"
import { useState } from "react"
import Image from "next/image";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { CgProfile } from "react-icons/cg";

export default function Component() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-background border-b">
        <div className="flex items-center justify-between max-w-[1280px] mx-auto px-2 py-1 sm:px-6 md:px-8 lg:px-10">
            <div className="flex items-center w-full sm:gap-12 md:gap-8 gap-2 md:me-6">
          <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
        <Image src="/logo.png" alt="Increati" width={72} height={72} />
      </Link>
          </div>
          
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`max-w-xl h-9 rounded-md border border-input pl-10 text-sm 
                    focus:border-primary bg-secondary focus:bg-background focus:outline-none 
                    ${isSearchFocused ? 'w-full' : 'sm:w-[280px]'}
                    transition-all duration-300 ease-in-out`}
                    />
            </div>
        </div>
          <div className="flex items-center space-x-4 md:w-80 w-auto justify-evenly">
            <div className="flex sm:gap-10 lg:gap-14">

            <Link 
              href="#" 
              className="hidden md:flex flex-col items-center text-xs font-medium text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              <Home className="h-6 w-6" />
            </Link>
            <Link 
              href="#" 
              className="hidden md:flex flex-col items-center text-xs font-medium text-muted-foreground hover:text-foreground"
              prefetch={false}
              >
              <Bell className="h-6 w-6" />
            </Link>
            <Link 
              href="#" 
              className="flex flex-col items-center text-xs font-medium text-muted-foreground hover:text-foreground md:ms-0 md:me-0 ms-5 me-2"
              prefetch={false}
              >
              <Mail className="h-6 w-6" />
            </Link>
            <Link 
              href="#" 
              className="hidden md:flex flex-col items-center text-xs font-medium text-muted-foreground hover:text-foreground"
              prefetch={false}
              >
              <SignedIn>
                <UserButton>
                    <UserButton.MenuItems>
                        <UserButton.Link
                            label="Profile"
                            labelIcon={<CgProfile size={"sm"} />}
                            href="/profile"
                        />
                    </UserButton.MenuItems>
                </UserButton>
              </SignedIn>
            </Link>
        </div>

            
          </div>
        </div>
      </header>

      <div className="md:hidden fixed bottom-0 left-0 z-10 flex w-full items-center justify-around bg-background border-t pb-5 pt-3">
        <Link
          href="#"
          className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          prefetch={false}
        >
          <Home className="h-6 w-6" />
        </Link>
        <Link
          href="#"
          className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          prefetch={false}
        >
          <Bell className="h-6 w-6" />
        </Link>
        <Link
          href="#"
          className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          prefetch={false}
        >
          <SignedIn>
                <UserButton></UserButton>
              </SignedIn>
        </Link>
      </div>
    </>
  )
}