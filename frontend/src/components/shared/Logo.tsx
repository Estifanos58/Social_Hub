"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ collapsed = false, className, size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <div
        className={cn(
          "relative shrink-0 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/25 p-1.5 transition-all duration-200 group-hover:scale-105 group-hover:border-primary/40 shadow-xs",
          iconSizes[size]
        )}
      >
        <Image
          src="/logo-amber.png"
          alt="SocialHub"
          width={40}
          height={40}
          className="h-full w-full object-contain"
          priority
        />
      </div>

      {!collapsed && (
        <span
          className={cn(
            "font-bold tracking-tight text-foreground truncate",
            textSizes[size]
          )}
        >
          Social<span className="text-primary font-black">Hub</span>
        </span>
      )}
    </div>
  );
}
