"use client";

import React from "react";
import { MessageSquare, Shield, Users, Heart } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export function AuthShowcase() {
  return (
    <div className="relative h-full w-full flex flex-col justify-between p-8 md:p-10 bg-gradient-to-br from-card/80 via-card/50 to-background border-r border-border/60 overflow-hidden select-none">
      {/* Subtle ambient warmth */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10">
        <Logo size="lg" />
      </div>

      {/* Center Cards */}
      <div className="relative z-10 my-auto py-8 space-y-5">
        <div className="space-y-2">
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
            Connect with friends. <br />
            <span className="text-primary font-black">
              Share what matters.
            </span>
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            Experience real-time social networking designed for conversations, community, and speed.
          </p>
        </div>

        {/* Feature preview cards */}
        <div className="space-y-2.5 pt-1">
          {/* Card 1 */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/70 backdrop-blur-xs shadow-xs">
            <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground">Real-time Messaging</p>
              <p className="text-[11px] text-muted-foreground truncate">Direct conversations and group chatrooms</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/70 backdrop-blur-xs shadow-xs">
            <div className="h-8 w-8 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
              <Heart className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground">Community Reactions</p>
              <p className="text-[11px] text-muted-foreground truncate">Reactions, media galleries, threaded comments</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/70 backdrop-blur-xs shadow-xs">
            <div className="h-8 w-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground">Fast & Secure</p>
              <p className="text-[11px] text-muted-foreground truncate">Built on modern, robust web standards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Trust Footer */}
      <div className="relative z-10 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium">
          <Users className="h-3.5 w-3.5 text-primary" />
          Active community
        </span>
        <span className="font-mono text-[11px]">SocialHub</span>
      </div>
    </div>
  );
}
