"use client";
import React from 'react';
import { Button } from '../ui/button';
import { signOut, useSession } from 'next-auth/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from 'lucide-react';
import Image from 'next/image';

const UserAccountNavbar = () => {
    const { data: session } = useSession();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 border-0 hover:bg-secondary transition-all duration-200 ease-in-out"
                >
                    <div className="h-full w-full overflow-hidden rounded-full">
                        <Image
                            src={session?.user?.image || "/avatar.png"}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                            priority
                        />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-52" 
                align="end" 
                forceMount
            >
                <DropdownMenuLabel className="py-3">
                    <p className="text-sm font-medium">
                        Pradeep Muthusamy
                    </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="flex items-center py-3 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors duration-200"
                    onClick={() => signOut({
                        redirect: true,
                        callbackUrl: `${window.location.origin}/auth/login`,
                    })}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserAccountNavbar;