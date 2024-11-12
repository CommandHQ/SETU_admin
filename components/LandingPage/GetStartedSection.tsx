"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "../ui/animated-beam";
import { RainbowButton } from "../ui/rainbow-button";

export function GetStartedSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex flex-col items-center justify-center py-16 bg-background">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
        Get Started Today
      </h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Experience seamless platform management and drive your community forward.
      </p>

      {/* Button and Beam */}
      <div className="relative mt-8" ref={containerRef}>
        <div ref={buttonRef}>
        <RainbowButton
            className={cn(
              "px-8 py-4 text-lg font-bold text-white rounded-lg",
              "bg-[#B13632] hover:bg-[#1B1461] transition-colors duration-300"
            )}
          >
            SIGN-IN
            </RainbowButton>
        </div>

        {/* Animated Beam */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={buttonRef}
          toRef={buttonRef}
          curvature={0}
          endYOffset={0}
          className="text-[#B13632] opacity-70"
        />
      </div>
    </div>
  );
}
