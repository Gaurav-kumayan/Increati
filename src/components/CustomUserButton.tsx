"use client";
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu" 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Loader2, LogOut, Settings2, User } from 'lucide-react'
import { SignOutButton, useClerk, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

const CustomUserButton = () => {
    const {openUserProfile}=useClerk();
    const {isLoaded,user}=useUser();
    const [open, setOpen] = useState(false);
    const [openSignOutDialog, setOpenSignOutDialog] = useState(false);
    const [shouldLoadProfile, setShouldLoadProfile] = useState(false);
    const pathname=usePathname();
    if(!isLoaded || !user) return <Skeleton className="h-6 w-6 rounded-full" />
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
  <DropdownMenuTrigger className='outline-none'>
    <Avatar className='w-7 h-7'>
        <AvatarImage src={user.imageUrl} />
        <AvatarFallback>{user.firstName?.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent sideOffset={8} align='end' className='min-w-72'>
    <DropdownMenuItem className='cursor-pointer' asChild onSelect={(e)=>{if(pathname!==`/user/${user.username}`){e.preventDefault(); setOpen(true); setShouldLoadProfile(true);}}}>
      <Link href={`/user/${user.username}`} className='flex gap-[1rem]'>
    <Avatar className='w-9 h-9'>
        <AvatarImage src={user.imageUrl} />
        <AvatarFallback>{user.firstName?.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
    <div className="flex flex-col">
        <span className='text-[0.8125rem] font-medium'>{user.firstName} {user.lastName}</span>
        <span className='text-[0.8125rem] font-medium'>{user.username}</span>
    </div>
      </Link>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={()=>{openUserProfile()}} className='cursor-pointer'><Settings2/>Manage Account</DropdownMenuItem>
    <DropdownMenuItem asChild className='cursor-pointer' onSelect={(e)=>{if(pathname!==`/user/${user.username}`){e.preventDefault(); setOpen(true); setShouldLoadProfile(true);}}}>
    <Link href={`/user/${user.username}`} className="flex items-center gap-2">
    {
      shouldLoadProfile? <Loader2 className="w-4 h-4 animate-spin" />:<User className="w-4 h-4" />
    }
    Profile
  </Link>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <Dialog open={openSignOutDialog} onOpenChange={setOpenSignOutDialog}>
      <DialogTrigger asChild>
        <DropdownMenuItem 
        onSelect={(e) => {
          e.preventDefault(); // Prevents the dropdown from closing
          setOpen(true);
        }}
         className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Sign Out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out? You will need to log in again to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpenSignOutDialog(false)}>Cancel</Button>
          <SignOutButton><Button variant='destructive'>SignOut</Button></SignOutButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </DropdownMenuContent>
</DropdownMenu>
  )
}

export default CustomUserButton