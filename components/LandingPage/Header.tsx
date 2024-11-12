"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSignInClick = (e:any) => {
    e.preventDefault();
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/setu_logo.jpg" width={40} height={40} alt="SETU Logo" />
          <span className="font-bold text-lg sm:text-xl">SETU Admin</span>
        </Link>
        <div onClick={handleSignInClick}>
          <Button size="sm" className="hidden sm:flex">
            <LogIn className="mr-2 h-4 w-4" />
            {session ? 'Dashboard' : 'Sign In'}
          </Button>
          <Button size="icon" variant="ghost" className="sm:hidden">
            <LogIn className="h-5 w-5" />
            <span className="sr-only">{session ? 'Dashboard' : 'Sign In'}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;