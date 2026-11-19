"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  image?: string;
  link?: string;
  badge?: React.ReactNode;
  onClick?: () => void;
}

export const SidebarItem = ({
  icon,
  label,
  collapsed,
  link,
  badge,
  onClick,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = link ? (link === "/" ? pathname === "/" : pathname?.startsWith(link)) : false;

  const handleClick = () => {
    if (onClick) onClick();
  };

  const content = (
    <div
      className={cn(
        "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer select-none",
        isActive
          ? "bg-primary/15 text-primary shadow-xs font-semibold"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
        collapsed && "justify-center px-2.5"
      )}
      onClick={handleClick}
      title={collapsed ? label : undefined}
    >
      <span className={cn("shrink-0 transition-transform duration-150 group-hover:scale-105", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>
        {icon}
      </span>
      {!collapsed && (
        <span className="truncate flex-1 tracking-tight">{label}</span>
      )}
      {badge && (
        <div className={cn("ml-auto shrink-0", collapsed && "absolute -top-1 -right-1")}>
          {badge}
        </div>
      )}
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
};
