"use client";

import React from "react";
import { MessageSquare } from "lucide-react";

export const MessagesSkeleton = () => (
  <div className="flex flex-col gap-4 py-4">
    {Array.from({ length: 5 }).map((_, index) => {
      const isRight = index % 2 === 1;
      return (
        <div
          key={index}
          className={`flex items-end gap-2.5 animate-pulse ${
            isRight ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <div className="h-8 w-8 rounded-full bg-secondary/80 shrink-0" />
          <div
            className={`rounded-2xl p-3.5 space-y-1.5 ${
              isRight
                ? "bg-primary/20 rounded-tr-xs w-48 sm:w-64"
                : "bg-secondary/50 border border-border/50 rounded-tl-xs w-56 sm:w-72"
            }`}
          >
            <div className="h-3 w-3/4 bg-white/20 rounded" />
            <div className="h-2.5 w-1/2 bg-white/10 rounded" />
          </div>
        </div>
      );
    })}
  </div>
);

export const ChatHeaderSkeleton = () => (
  <div className="flex items-center gap-3 border-b border-border/70 bg-card/60 px-6 py-3.5 animate-pulse">
    <div className="h-10 w-10 rounded-full bg-secondary/80 shrink-0" />
    <div className="space-y-1.5">
      <div className="h-3.5 w-32 rounded bg-secondary/80" />
      <div className="h-2.5 w-20 rounded bg-secondary/60" />
    </div>
  </div>
);

export const EmptyState = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20 text-center text-muted-foreground">
    <div className="h-12 w-12 rounded-2xl bg-secondary/60 border border-border/60 flex items-center justify-center mb-1 text-primary">
      <MessageSquare className="h-6 w-6" />
    </div>
    <p className="text-sm font-semibold text-foreground">No messages yet</p>
    <p className="text-xs max-w-xs">Send a message below to start this conversation.</p>
  </div>
);
