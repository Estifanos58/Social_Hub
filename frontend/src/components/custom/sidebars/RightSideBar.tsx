"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GET_USERS_TO_FOLLOW } from "@/graphql/queries/user/getUsersToFollow";
import { useQuery } from "@apollo/client/react";
import { GetUsersToFollowQuery } from "@/gql/graphql";
import { RightSideFooterLinks } from "@/lib/links";
import SidebarContact, { RightSideLoading } from "./SidebarContact";
import { useUserStore } from "@/store/userStore";
import { UserPlus, ChevronRight } from "lucide-react";

function RightSideBar() {
  const { data, loading, error } = useQuery<GetUsersToFollowQuery>(
    GET_USERS_TO_FOLLOW,
    {
      variables: { limit: 10, offset: 0 },
      fetchPolicy: "cache-and-network",
    }
  );

  const { user, usersToFollow, setUsersToFollow } = useUserStore();

  useEffect(() => {
    if (!loading && data?.GetUsersToFollow?.users) {
      setUsersToFollow(data.GetUsersToFollow.users as any);
    }
  }, [loading, data, setUsersToFollow]);

  const year = new Date().getFullYear();

  return (
    <div className="hidden lg:flex w-[340px] border-l border-border/70 bg-sidebar/60 flex-col justify-between p-4 h-full overflow-y-auto shrink-0 select-none">
      <div className="space-y-6">
        {/* User Card */}
        {user && (
          <Link
            href={`/profile/${user.id}`}
            className="flex items-center justify-between p-3 rounded-xl bg-card/60 border border-border/60 hover:bg-card hover:border-border transition-all duration-150 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border border-border">
                <Image
                  src={user.avatarUrl || "/noAvatar.png"}
                  alt={user.firstname || "User"}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {user.firstname || "Guest"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  View your profile
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
          </Link>
        )}

        {/* Suggested Users */}
        <div className="rounded-xl bg-card/40 border border-border/60 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Suggested for you
            </h2>
            <button className="text-xs text-primary hover:underline font-medium cursor-pointer">
              Refresh
            </button>
          </div>

          <div className="space-y-1">
            {loading ? (
              <RightSideLoading />
            ) : error ? (
              <p className="text-destructive text-xs py-2 text-center">Unable to load suggestions</p>
            ) : usersToFollow && usersToFollow.length > 0 ? (
              usersToFollow.slice(0, 5).map((user: any) => (
                <SidebarContact key={user.id} user={user} />
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground text-xs">
                No new users to follow
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-border/60 text-[11px] text-muted-foreground space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {RightSideFooterLinks.map((link) => (
            <button key={link.label} className="hover:text-foreground transition-colors cursor-pointer">
              {link.label}
            </button>
          ))}
        </div>
        <p className="text-muted-foreground/60">© {year} SocialHub by Estifanos Kebede</p>
      </div>
    </div>
  );
}

export default RightSideBar;
