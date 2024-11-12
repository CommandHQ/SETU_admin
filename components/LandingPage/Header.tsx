"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSignInClick = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 xl:px-40 md:px-10">
      <div className="container flex h-16 items-center justify-between p-4">
        <Link 
          href="/" 
          className="flex items-center space-x-3 transition-transform hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SETU Admin
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Management Portal
            </span>
          </div>
        </Link>

        <div onClick={handleSignInClick} className="flex items-center space-x-4">
          <Button 
            size="sm" 
            className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {session ? 'Dashboard' : 'Sign In'}
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="sm:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <LogIn className="h-5 w-5" />
            <span className="sr-only">{session ? 'Dashboard' : 'Sign In'}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;