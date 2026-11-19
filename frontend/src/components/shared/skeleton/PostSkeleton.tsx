"use client";
import React from "react";

export const PostSkeleton: React.FC<{ withImage?: boolean }> = ({ withImage = true }) => {
  return (
    <div className="w-full max-w-[620px] bg-card/75 border border-border/70 rounded-2xl p-4 md:p-5 shadow-xs animate-pulse text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/80 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 bg-secondary/80 rounded" />
            <div className="h-2.5 w-20 bg-secondary/60 rounded" />
          </div>
        </div>
        <div className="h-3 w-16 bg-secondary/60 rounded" />
      </div>

      {/* Content lines */}
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-secondary/70 rounded" />
        <div className="h-3 w-5/6 bg-secondary/70 rounded" />
        <div className="h-3 w-3/4 bg-secondary/60 rounded" />
      </div>

      {/* Image placeholder */}
      {withImage && (
        <div className="mb-4 w-full h-64 md:h-72 bg-secondary/60 rounded-xl" />
      )}

      {/* Actions */}
      <div className="pt-2 border-t border-border/60 flex items-center gap-4">
        <div className="h-7 w-16 bg-secondary/70 rounded-lg" />
        <div className="h-7 w-16 bg-secondary/70 rounded-lg" />
      </div>
    </div>
  );
};

export const PostSkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="w-full space-y-4 flex flex-col items-center">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} withImage={i % 2 === 0} />
      ))}
    </div>
  );
};
