"use client";

import React from "react";
import Image from "next/image";
import { Activity, Shield, Users } from "lucide-react";

const Globe = ({ className }: { className?: string }) => (
  <div className={className}>
    <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400/40 to-indigo-500/40 blur-xl animate-pulse" />
  </div>
);

const FeatureCard = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center space-x-2 rounded-full bg-background/50 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 border border-border/50 shadow-sm">
    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
    <span className="text-xs sm:text-sm font-medium text-foreground">{title}</span>
  </div>
);

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90 py-8 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 xl:px-40 md:px-10">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-400/[0.05] bg-[size:20px_20px] sm:bg-[size:40px_40px] opacity-100" />
      <div className="absolute -top-52 right-0 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px] rounded-full bg-gradient-to-br from-primary/30 to-purple-600/30 blur-3xl" />
      <div className="absolute -bottom-52 left-0 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px] rounded-full bg-gradient-to-tr from-blue-600/30 to-primary/30 blur-3xl" />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          {/* Content */}
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none xl:col-span-6">
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center space-x-4 rounded-full bg-primary/10 px-4 sm:px-6 py-1.5 sm:py-2 mb-6 sm:mb-8">
                  <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-primary"></span>
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-primary">Admin Dashboard Live</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-gradient">
                  SETU
                </h1>
              </div>
            </div>
            
            <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Admin Dashboard
            </h2>
            
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Empower your veterinary network with advanced management tools and
              real-time insights. Streamline your operations and enhance patient
              care with our comprehensive admin dashboard.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col space-y-4">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <FeatureCard icon={Activity} title="Real-time Analytics" />
                <FeatureCard icon={Shield} title="Secure Access" />
                <FeatureCard icon={Users} title="Team Management" />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative mt-8 sm:mt-12 lg:mt-0 lg:col-span-5 xl:col-span-6">
            <Globe className="absolute -top-32 sm:-top-48 lg:-top-64 -right-32 sm:-right-48 lg:-right-64 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[530px] lg:h-[530px]" />
            <Globe className="absolute -bottom-20 sm:-bottom-32 lg:-bottom-40 -left-24 sm:-left-32 lg:-left-44 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[567px] lg:h-[567px]" />
            
            <div className="relative rounded-xl sm:rounded-2xl bg-gradient-to-b from-primary/5 to-primary/30 p-1.5 sm:p-2 transition-transform hover:scale-[1.02] duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-xl sm:rounded-2xl" />
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-2xl">
                <div className="aspect-[16/10] relative bg-background">
                  <Image
                    src="https://cdn1.dronahq.com/wp-content/uploads/2024/08/Dashboard-Image-Final.webp"
                    alt="SETU Admin Dashboard preview"
                    priority
                    width={1000}
                    height={100}
                    className="object-cover transition-transform hover:scale-105 duration-700"
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