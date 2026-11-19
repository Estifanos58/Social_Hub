"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import {
  Home,
  Bell,
  MessageSquare,
  Users,
  User,
  Search,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { Logo } from "@/components/shared/Logo";

import { useGeneralStore } from "@/store/generalStore";
import { useUserStore } from "@/store/userStore";
import { SidebarItem } from "../SidebarItem";
import CreatePost from "../post/CreatePost";
import SearchPopUp from "./popUps/SearchPopUp";
import FollowersPopUp from "./popUps/FollowersPopUp";
import NotificationsPopUp from "./popUps/NotificationsPopUp";
import MessagePopUp from "./popUps/MessagePopUp";
import { GET_UNREAD_NOTIFICATIONS_COUNT } from "@/graphql/queries/notification/getUnreadNotificationsCount";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const LeftSideBar = () => {
  const { data: unreadData } = useQuery<{ unreadNotificationsCount: number }>(
    GET_UNREAD_NOTIFICATIONS_COUNT,
    { pollInterval: 20000 }
  );
  const router = useRouter();
  const unreadCount = unreadData?.unreadNotificationsCount ?? 0;

  const {
    isCollapsed,
    setIsCollapsed,
    isMobile,
    setMobile,
    showPopup,
    setShowPopup,
    selectedPopUp,
    setSelectedPopUp,
  } = useGeneralStore();

  const { user: currentUser } = useUserStore();

  const navLinks = [
    {
      icon: <Home className="size-5" />,
      label: "Feed",
      href: "/",
    },
    {
      icon: <Search className="size-5" />,
      label: "Search",
      onClick: () => {
        setShowPopup(true);
        setIsCollapsed(true);
        setSelectedPopUp("search");
      },
    },
    {
      icon: <Bell className="size-5" />,
      label: "Notifications",
      badge: unreadCount > 0 ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white shadow-xs">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null,
      onClick: () => {
        setShowPopup(true);
        setIsCollapsed(true);
        setSelectedPopUp("notifications");
      },
    },
    {
      icon: <MessageSquare className="size-5" />,
      label: "Messages",
      href: "/message",
      onClick: () => {
        setShowPopup(true);
        setIsCollapsed(true);
        setSelectedPopUp("message");
      },
    },
    {
      icon: <Users className="size-5" />,
      label: "Connections",
      onClick: () => {
        setShowPopup(true);
        setIsCollapsed(true);
        setSelectedPopUp("connections");
      },
    },
    {
      icon: <User className="size-5" />,
      label: "Profile",
      href: currentUser?.id ? `/profile/${currentUser.id}` : "/auth",
    },
  ];

  const handleMobileNavClick = (link: (typeof navLinks)[number]) => {
    if (link.onClick) {
      link.onClick();
      return;
    }
    if (link.href) {
      router.push(link.href);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setMobile(true);
        setIsCollapsed(true);
      } else if (window.innerWidth <= 1180) {
        setIsCollapsed(true);
        setMobile(false);
      } else {
        setIsCollapsed(false);
        setMobile(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsCollapsed, setMobile]);

  // Mobile Bottom Bar
  if (isMobile) {
    return (
      <>
        {showPopup && (
          <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {selectedPopUp === "search" && (
                <SearchPopUp setShowPopup={setShowPopup} setIsCollapsed={setIsCollapsed} />
              )}
              {selectedPopUp === "connections" && (
                <FollowersPopUp setShowPopup={setShowPopup} setIsCollapsed={setIsCollapsed} />
              )}
              {selectedPopUp === "notifications" && (
                <NotificationsPopUp setIsCollapsed={setIsCollapsed} setShowPopup={setShowPopup} />
              )}
              {selectedPopUp === "message" && (
                <MessagePopUp setShowPopup={setShowPopup} setIsCollapsed={setIsCollapsed} />
              )}
            </div>
          </div>
        )}

        <nav
          aria-label="Mobile navigation"
          className="fixed bottom-0 left-0 w-full bg-card/90 backdrop-blur-lg border-t border-border/80 flex items-center justify-around px-2 py-2 z-50 shadow-lg"
        >
          {navLinks.slice(0, 2).map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => handleMobileNavClick(link)}
              className="flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-foreground relative transition-colors"
              aria-label={link.label}
            >
              {link.icon}
              {link.badge && <span className="absolute top-1 right-1">{link.badge}</span>}
            </button>
          ))}

          <div className="shrink-0 -mt-5">
            <CreatePost />
          </div>

          {navLinks.slice(2, 5).map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => handleMobileNavClick(link)}
              className="flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-foreground relative transition-colors"
              aria-label={link.label}
            >
              {link.icon}
              {link.badge && <span className="absolute top-1 right-1">{link.badge}</span>}
            </button>
          ))}
        </nav>
      </>
    );
  }

  // Desktop Left Sidebar
  return (
    <aside
      aria-label="Main sidebar"
      className="bg-sidebar border-r border-border/70 flex h-screen sticky top-0 transition-all duration-200 select-none z-40 shrink-0"
    >
      <div className={`flex flex-col justify-between p-3.5 ${isCollapsed ? "w-[72px]" : "w-[240px]"} transition-all duration-200`}>
        {/* Top: Brand Logo */}
        <div>
          <Link
            href="/"
            className="flex items-center px-2 py-2.5 rounded-xl hover:bg-accent/40 transition-colors group mb-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Logo collapsed={isCollapsed} size="md" />
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5" aria-label="Sidebar links">
            {navLinks.map((link) => (
              <SidebarItem
                key={link.label}
                icon={link.icon}
                label={link.label}
                collapsed={isCollapsed}
                link={link.href}
                badge={link.badge}
                onClick={link.onClick}
              />
            ))}
          </nav>

          <div className="mt-5 px-1">
            <CreatePost />
          </div>
        </div>

        {/* Bottom: Current User Pill */}
        {currentUser && (
          <div className="pt-3 border-t border-border/60">
            <Link
              href={`/profile/${currentUser.id}`}
              className={`flex items-center gap-3 p-2 rounded-xl hover:bg-accent/60 transition-colors group ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <Avatar className="h-9 w-9 shrink-0 ring-1 ring-border/80 group-hover:ring-primary/40 transition-all">
                <AvatarImage src={currentUser.avatarUrl || "/noAvatar.png"} alt={currentUser.firstname} />
                <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
                  {currentUser.firstname?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {currentUser.firstname} {currentUser.lastname || ""}
                  </span>
                  <span className="text-[11px] text-muted-foreground truncate">
                    {currentUser.email || "View profile"}
                  </span>
                </div>
              )}
            </Link>
          </div>
        )}
      </div>

      {/* Flyout popup drawer */}
      {showPopup && (
        <div className="w-84 h-screen bg-card/95 backdrop-blur-md border-r border-border text-foreground z-50 shadow-2xl shadow-black/40 flex flex-col animate-[fadeIn_150ms_ease-out]">
          {selectedPopUp === "search" && (
            <SearchPopUp setShowPopup={setShowPopup} setIsCollapsed={setIsCollapsed} />
          )}
          {selectedPopUp === "connections" && (
            <FollowersPopUp setShowPopup={setShowPopup} setIsCollapsed={setIsCollapsed} />
          )}
          {selectedPopUp === "notifications" && (
            <NotificationsPopUp setIsCollapsed={setIsCollapsed} setShowPopup={setShowPopup} />
          )}
          {selectedPopUp === "message" && (
            <MessagePopUp setShowPopup={setShowPopup} setIsCollapsed={setIsCollapsed} />
          )}
        </div>
      )}
    </aside>
  );
};
