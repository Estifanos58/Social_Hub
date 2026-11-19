"use client";

import Image from "next/image";
import { useFollowersPopup } from "../../../../hooks/user/useFollowersPopup";
import { formatBio } from "@/lib/utils";
import { Users, X, UserMinus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FollowersPopUpProps {
  setShowPopup: (value: boolean) => void;
  setIsCollapsed: (value: boolean) => void;
}

function FollowersPopUp({ setShowPopup, setIsCollapsed }: FollowersPopUpProps) {
  const {
    activeTab,
    setActiveTab,
    currentList,
    totalFollowers,
    totalFollowing,
    loading,
    scrollRef,
    pendingUnfollowUser,
    unfollowError,
    unfollowLoading,
    handleScroll,
    handleOpenUnfollowModal,
    handleConfirmUnfollow,
    handleCloseUnfollowModal,
  } = useFollowersPopup();

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold tracking-tight text-foreground">Connections</h2>
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

      {/* Tabs with counts */}
      <div className="flex bg-secondary/50 p-1 rounded-xl border border-border/60 mb-3">
        <button
          onClick={() => setActiveTab("followers")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
            activeTab === "followers"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Followers ({totalFollowers})
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
            activeTab === "following"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Following ({totalFollowing})
        </button>
      </div>

      {/* Users List */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-2 pr-1"
      >
        {/* Skeleton Loader */}
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/30 animate-pulse"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-9 h-9 bg-muted/40 rounded-full shrink-0"></div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="w-24 h-3 bg-muted/40 rounded"></div>
                  <div className="w-16 h-2.5 bg-muted/30 rounded"></div>
                </div>
              </div>
              <div className="w-18 h-7 bg-muted/40 rounded-full shrink-0"></div>
            </div>
          ))}

        {/* Users */}
        {!loading &&
          currentList.map((user: any) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2.5 hover:bg-secondary/40 rounded-xl transition-colors group"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <Image
                  src={user.avatarUrl || "/noAvatar.png"}
                  alt={user.firstname}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-border shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate">{user.firstname}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{formatBio(user.bio)}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenUnfollowModal(user)}
                className="h-7 text-[11px] font-medium px-3 rounded-full shrink-0 ml-2 border-border/80 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 transition-colors"
              >
                Following
              </Button>
            </div>
          ))}

        {/* Empty states */}
        {!loading && currentList.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-xs space-y-1">
            <Users className="h-6 w-6 mx-auto opacity-30 mb-2" />
            <p className="font-semibold text-foreground">
              {activeTab === "followers" ? "No followers yet" : "Not following anyone"}
            </p>
            <p>
              {activeTab === "followers"
                ? "When people follow you, they'll appear here."
                : "Explore suggested users to start building connections."}
            </p>
          </div>
        )}
      </div>

      {pendingUnfollowUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl animate-[fadeIn_150ms_ease-out]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-full bg-destructive/15 text-destructive">
                <UserMinus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Unfollow @{pendingUnfollowUser.firstname}?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Their posts will no longer appear in your personal feed.
                </p>
              </div>
            </div>

            {unfollowError && (
              <p className="mb-3 rounded-lg bg-destructive/10 border border-destructive/20 p-2 text-xs text-destructive">
                {unfollowError}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseUnfollowModal}
                disabled={unfollowLoading}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmUnfollow}
                disabled={unfollowLoading}
                className="rounded-lg"
              >
                {unfollowLoading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Unfollowing...
                  </span>
                ) : (
                  "Unfollow"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FollowersPopUp;
