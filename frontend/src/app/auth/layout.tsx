import React from "react";
import { AuthShowcase } from "@/components/custom/auth/AuthShowcase";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen bg-background items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/30 via-background to-background pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl bg-card/90 border border-border/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md min-h-[580px]">
        {/* Left Side Product Showcase */}
        <div className="hidden md:block h-full">
          <AuthShowcase />
        </div>

        {/* Right Side Form */}
        <div className="flex flex-col justify-center p-6 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
