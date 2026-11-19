"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useMutation } from "@apollo/client/react";
import { FOLLOW_USER } from "@/graphql/mutations/user/FollowUser";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCheck, UserPlus, Loader2 } from "lucide-react";

function SidebarContact({
  user,
}: {
  user: { id: string; firstname: string; lastname?: string; avatarUrl?: string; isFollowing?: boolean };
}) {
  const [followUser, { loading }] = useMutation(FOLLOW_USER);
  const { removeUserFromToFollow } = useUserStore();

  const handleFollow = (followingId: string) => {
    if (!followingId) return;

    followUser({
      variables: { followingId },
      onCompleted(data: any) {
        if (data.followUser) {
          removeUserFromToFollow(followingId);
        }
      },
    });
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-card/60 transition-colors group">
      <Link href={`/profile/${user.id}`} className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border border-border/80 group-hover:border-primary/40 transition-colors">
          <Image
            src={user.avatarUrl || "/noAvatar.png"}
            alt={user.firstname}
            width={40}
            height={40}
            className="object-cover h-full w-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {user.firstname} {user.lastname || ""}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            @{user.firstname?.toLowerCase()}
          </p>
        </div>
      </Link>
      <Button
        size="sm"
        variant={user.isFollowing ? "secondary" : "outline"}
        className="h-8 rounded-full text-xs font-medium px-3.5 shrink-0 border-border/80 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-150 cursor-pointer"
        disabled={loading}
        onClick={() => handleFollow(user.id)}
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : user.isFollowing ? (
          <span className="flex items-center gap-1">
            <UserCheck className="h-3 w-3" /> Following
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <UserPlus className="h-3 w-3" /> Follow
          </span>
        )}
      </Button>
    </div>
  );
}

export const RightSideLoading = () => {
  return [...Array(4)].map((_, i) => (
    <div key={i} className="flex items-center justify-between p-2 animate-pulse gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Skeleton className="h-10 w-10 rounded-full bg-muted/40 shrink-0" />
        <div className="space-y-1.5 flex-1 min-w-0">
          <Skeleton className="h-3.5 w-24 bg-muted/40 rounded" />
          <Skeleton className="h-3 w-16 bg-muted/30 rounded" />
        </div>
      </div>
      <Skeleton className="h-7 w-16 rounded-full bg-muted/40 shrink-0" />
    </div>
  ));
};

export default SidebarContact;
