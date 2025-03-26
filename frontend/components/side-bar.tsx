"use client";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Use usePathname from App Router
import {
  LayoutDashboard,
  Bot,
  ClipboardPlus,
  Dumbbell,
  LogOut,
  HandHelping,
  Video,
  Frame,
  Minimize,
  Captions,
  ZoomIn,
  BriefcaseMedical,
  Gamepad,
  Speaker,
  User,
  Smile,
} from "lucide-react";
import { Button } from './ui/button';

interface SidebarLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const sidebarLinks: SidebarLink[] = [
  
  {
    title: "AI Chat",
    href: "/chatbot",
    icon: Bot,
    color: "text-green-500",
  },
  
  {
    title: "IFS Therapy",
    href: "/ifs-therapy",
    icon: BriefcaseMedical,
    color: "text-blue-500",
  },
  {
    title: "MediBuddy",
    href: "/medibuddy",
    icon: Smile,
    color: "text-blue-500",
  },
  
  {
    title: "Fitbit",
    href: "/fitbit",
    icon: LayoutDashboard,
    color: "text-yellow-500",
  },
  {
    title: "Public Speaking",
    href: "/public-speaking",
    icon: Speaker,
    color: "text-purple-500",
  },
  {
    title: "Journal",
    href: "/journal",
    icon: ClipboardPlus,
    color: "text-blue-500",
  },
  {
    title: "Meditation",
    href: "/meditation",
    icon: Dumbbell,
    color: "text-purple-500",
  },
  
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: LayoutDashboard,
    color: "text-red-500",
  },
  {
    title: "Challenges",
    href: "/challenges",
    icon: HandHelping,
    color: "text-teal-500",
  },
  {
    title: "Communities",
    href: "/communities",
    icon: LayoutDashboard,
    color: "text-indigo-500",
  },
  {
    title: "Mini Games",
    href: "/mini-games",
    icon: Gamepad,
    color: "text-indigo-500",
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    color: "text-orange-500",
  },
];


interface SidebarProps {
  children: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname(); // Get the current path using usePathname
  const [activeLink, setActiveLink] = useState<string>("");

  useEffect(() => {
    setActiveLink(pathname); // Set active link based on the current pathname
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex md:flex-col w-64 bg-white shadow-lg h-screen fixed top-0 left-0 z-50">
        <div className="p-6 border-b border-pink-100">
          <Link href="/">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              MindMitra
            </h1>
          </Link>
        </div>
        <nav className="flex-1 px-4 pb-4 pt-4">
          {sidebarLinks.map(({ title, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-pink-50 ${activeLink === href ? 'bg-pink-100' : ''}`}
            >
              <Icon className={`h-5 w-5 ${color}`} />
              <span>{title}</span>
            </Link>
          ))}
        </nav>
        <div className='flex '>
                      <SignedOut>
                        <SignInButton mode='modal'>
                          <Button variant="outline">
                            Sign In
                          </Button >
                        </SignInButton>
                      </SignedOut>
                      <SignedIn>
                        <UserButton />
                      </SignedIn>
                    </div>
      </aside>

      <div className="flex-1 flex flex-col md:ml-64 relative z-10 my-20 px-10  text-black">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
