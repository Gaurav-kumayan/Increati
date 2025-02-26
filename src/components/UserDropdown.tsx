import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { SignInButton } from "@clerk/nextjs"
import { Moon, Sun, User } from "lucide-react"

  import React, { Dispatch, SetStateAction } from 'react'
import { Skeleton } from "./ui/skeleton"
  
  const UserDropdown = ({theme,setTheme}:{theme:"dark"|"light"|undefined,setTheme:Dispatch<SetStateAction<"light" | "dark" | undefined>>}) => {
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <User className="h-6 w-6 text-muted-foreground hover:text-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Guest</DropdownMenuLabel>
        <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
                <SignInButton><div className="w-full">Sign in</div></SignInButton>
            </DropdownMenuItem>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
          <button className="w-full" onClick={()=>{setTheme(theme=="light"?"dark":"light")}}>
            {theme==undefined? <Skeleton className="h-6 w-6 rounded-full" />:theme=="light"?<Sun size={32}/>:<Moon size={24}/>}
            </button>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  
  export default UserDropdown