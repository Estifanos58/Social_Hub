"use client";

import React from "react";
import { MessageSquareDashed, Send } from "lucide-react";

interface MessageContainerProps {
  message?: string;
}

export function MessageContainer({
  message = "Select a conversation from the sidebar or start a new chat.",
}: MessageContainerProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-background text-foreground p-6">
      <div className="text-center space-y-4 max-w-sm p-8 rounded-2xl bg-card/40 border border-border/60">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/80 text-primary mx-auto ring-1 ring-border/80 shadow-xs">
          <MessageSquareDashed className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold tracking-tight text-foreground">Your Messages</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}
