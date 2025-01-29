"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/Navbar/navigation-menu";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const sections: { title: string; href: string; description: string }[] = [
  {
    title: "Communities",
    href: "/communities",
    description:
      "Explore and join communities of like-minded individuals. Collaborate, share, and grow together.",
  },
  {
    title: "Projects",
    href: "/projects",
    description:
      "Discover ongoing projects, contribute your skills, or showcase your own work to attract collaborators.",
  },
  {
    title: "Events",
    href: "/events",
    description:
      "Stay updated with events, hackathons, and meetups tailored to your interests.",
  },
  {
    title: "Resources",
    href: "/resources",
    description: "Access a curated list of resources to enhance your skills and knowledge.",
  },
  {
    title: "Discussions",
    href: "/discussions",
    description:
      "Engage in meaningful discussions, ask questions, and share insights with the community.",
  },
  {
    title: "Profile",
    href: "/profile",
    description: "Manage your profile, showcase your expertise, and connect with others.",
  },
];

export default function Navbar() {
  const {user, isLoaded}=useUser();
  console.log(user);
  return (
    <header className="flex items-center justify-between px-6 py-2 shadow-md">
      {/* Left Section: Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/logo.png" alt="Increati" width={72} height={72} />
      </Link>

      {/* Center Section: Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">Increati</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        A collaboration platform for individuals with shared interests. Connect, collaborate, and create.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/about" title="About Increati">
                  Learn more about our mission and how Increati empowers collaboration.
                </ListItem>
                <ListItem href="/getting-started" title="Getting Started">
                  Find out how to get started and make the most of the platform.
                </ListItem>
                <ListItem href="/faq" title="FAQ">
                  Answers to common questions about using Increati.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Sections</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {sections.map((section) => (
                  <ListItem
                    key={section.title}
                    title={section.title}
                    href={section.href}
                  >
                    {section.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/contact" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Contact Us
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right Section: Profile */}
      <div className="flex items-center space-x-4">
        { isLoaded?
          user?<UserButton />:
          <div className="flex items-center justify-center gap-4">
            <SignInButton ><Button>Sign In</Button></SignInButton>
            <SignInButton ><Button variant={"outline"}>Sign Up</Button></SignInButton>
          </div>:
          <Skeleton className="h-12 w-12 rounded-full" />
        }
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
