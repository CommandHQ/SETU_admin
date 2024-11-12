"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Globe = ({ className }: { className?: string }) => (
  <div className={className}>
    <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-50 animate-pulse" />
  </div>
);

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          {/* Content */}
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
                  SETU
                </h1>
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Admin Dashboard
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Empower your veterinary network with advanced management tools and
              real-time insights. Streamline your operations and enhance patient
              care with our comprehensive admin dashboard.
            </p>
            <div className="mt-8">
              <Link href="/login" passHref>
                <Button size="lg" className="rounded-full">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:mt-0 xl:col-span-6">
            <div className="relative">
              <Globe className="absolute -top-64 -right-64 w-[530px] h-[530px] opacity-50" />
              <Globe className="absolute -bottom-40 -left-44 w-[567px] h-[567px] opacity-50" />
              <div className="relative rounded-2xl bg-gradient-to-b from-primary/5 to-primary/30 p-2">
                <div className="relative overflow-hidden rounded-xl bg-background shadow-2xl aspect-[16/9]">
                  <Image
                    src="/dashboard.jpeg"
                    alt="SETU Admin Dashboard preview"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;