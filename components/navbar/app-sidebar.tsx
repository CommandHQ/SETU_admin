"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  Briefcase, 
  BriefcaseBusiness, 
  Building2, 
  ChevronDown,
  GraduationCap, 
  Home, 
  Network, 
  Newspaper, 
  School, 
  User2, 
  Users,
  ClipboardMinus
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
import Image from "next/image";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Jobs",
    url: "/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: ClipboardMinus,
  },
  {
    title: "Certifications",
    url: "/certification-sales",
    icon: GraduationCap,
  },
];

const Masteritems = [
  {
    title: "Certificates",
    url: "/master/certification",
    icon: Newspaper,
  },
  {
    title: "University",
    url: "/master/university",
    icon: School,
  },
  {
    title: "Field of Study",
    url: "/master/fieldofstudy",
    icon: GraduationCap,
  },
  {
    title: "Skill",
    url: "/master/skill",
    icon: Network,
  },
  {
    title: "Job Title",
    url: "/master/jobtitle",
    icon: Briefcase,
  },
  {
    title: "Company",
    url: "/master/company",
    icon: Building2,
  },
  {
    title: "Degree",
    url: "/master/degree",
    icon: GraduationCap,
  }
];

const MenuItem = ({ item, isActive }:any) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link 
          href={item.url}
          className={`
            flex items-center w-full rounded-lg px-3 py-2
            transition-colors duration-200
            ${isActive 
              ? 'bg-primary/10 text-primary font-medium' 
              : 'text-foreground/70 hover:bg-accent hover:text-accent-foreground'
            }
          `}
        >
          <item.icon className={`
            w-4 h-4 mr-3
            ${isActive ? 'text-primary' : 'text-foreground/70'}
          `} />
          <span className="text-sm">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

interface ClientSidebarProps {
  session: any;
}

export function ClientSidebar({ session }: ClientSidebarProps) {
  const pathname = usePathname();
  const isActive = (url: string) => pathname === url;
  
  return (
    <Sidebar className="border-r border-border bg-card pt-4 w-64">
      {/* Logo Section */}
      <div className="px-6 mb-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary/10 p-2 rounded-md">
            <Image 
              src="/setu.svg"
              width={24} 
              height={24} 
              alt="logo"
              className="rounded" 
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">SETU</h1>
            <p className="text-xs text-muted-foreground leading-none">Admin Portal</p>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 h-[calc(100vh-8rem)]">
        <SidebarContent className="px-4">
          <SidebarGroup>
            <SidebarGroupContent className="space-y-1">
              <SidebarMenu>
                {items.map((item) => (
                  <MenuItem 
                    key={item.title} 
                    item={item} 
                    isActive={isActive(item.url)}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator className="my-4 opacity-50" />

          <SidebarGroup>
            <Collapsible defaultOpen className="space-y-2">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  MASTER DATA
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent className="space-y-1">
                  <SidebarMenu>
                    {Masteritems.map((item) => (
                      <MenuItem 
                        key={item.title} 
                        item={item} 
                        isActive={isActive(item.url)}
                      />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        </SidebarContent>
      </ScrollArea>

      <SidebarFooter className="border-t border-border p-4 mt-auto">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
            <User2 className="h-4 w-4 text-accent-foreground" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium line-clamp-1">
              {session?.user?.name || 'Guest User'}
            </p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
