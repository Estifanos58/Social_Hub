"use client";
import React from "react";

export const CommentSkeleton: React.FC = () => (
  <div className="flex gap-2.5 py-1.5 animate-pulse">
    <div className="w-7 h-7 rounded-full bg-secondary/80 shrink-0" />
    <div className="flex-1 rounded-xl bg-secondary/40 border border-border/50 p-3 space-y-2">
      <div className="h-3 w-28 bg-secondary/80 rounded" />
      <div className="h-2.5 w-48 bg-secondary/60 rounded" />
    </div>
  </div>
);

export const CommentSkeletonList: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <CommentSkeleton key={i} />
    ))}
  </div>
);
