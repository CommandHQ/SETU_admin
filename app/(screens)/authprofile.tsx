"use client"

import { Button } from "@/components/ui/button";
import UserAccountNavbar from "@/components/navbar/UserAccountNavbar";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";


export const AuthSection = () => {
    const { data: session, status } = useSession();
  
    return (
      <div className="flex items-center gap-4 justify-end w-full">
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium"></span>
          <span className="text-[10px] text-gray-500 text-right"></span>
        </div>
        <div>
          {status === "loading" ? (
            <Button variant="ghost" disabled>Loading...</Button>
          ) : session?.user ? (
            <UserAccountNavbar />
          ) : (
            <Button 
              onClick={() => signIn(undefined, {
                callbackUrl: `${window.location.origin}`
              })}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    );
  };
  