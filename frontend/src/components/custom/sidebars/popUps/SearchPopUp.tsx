"use client";

import React, { useState } from "react";
import { Search, X, Clock, User, Compass } from "lucide-react";
import { Input } from "@/components/ui/input";

function SearchPopUp({
  setShowPopup,
  setIsCollapsed,
}: {
  setShowPopup: (value: boolean) => void;
  setIsCollapsed: (value: boolean) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold tracking-tight text-foreground">Search Hub</h2>
        </div>
        <button
          onClick={() => {
            setShowPopup(false);
            setIsCollapsed(false);
          }}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search people, tags, keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-secondary/50 border-border/70 text-foreground placeholder:text-muted-foreground/60 rounded-xl pl-9 pr-4 h-10 text-xs focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
        />
      </div>

      {/* Recent or Discover */}
      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Recent Searches
          </h3>
          <button className="text-[11px] text-primary hover:underline font-medium cursor-pointer">
            Clear all
          </button>
        </div>

        <div className="text-center py-16 text-muted-foreground text-xs space-y-2">
          <Compass className="h-8 w-8 mx-auto opacity-30" />
          <p className="font-medium text-foreground">Discover what&apos;s happening</p>
          <p className="text-[11px]">Type a query to search people, conversations, or topics.</p>
        </div>
      </div>
    </div>
  );
}

export default SearchPopUp;
