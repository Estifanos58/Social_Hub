"use client";

import React, { useState } from "react";
import RightSideBar from "@/components/custom/sidebars/RightSideBar";
import { PostDisplay } from "@/components/shared/PostDisplay";
import { GET_POSTS } from "@/graphql/queries/post/GetPosts";
import { useQuery } from "@apollo/client/react";
import { PostSkeletonList } from "@/components/shared/skeleton/PostSkeleton";
import { Compass, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function MainPage() {
  const [feedTab, setFeedTab] = useState<"forYou" | "following">("forYou");
  const { loading, data, error, refetch } = useQuery<any>(GET_POSTS, {
    variables: { take: 10, cursor: "" },
    fetchPolicy: "cache-and-network",
  });

  const renderPosts = () => {
    if (loading) {
      return (
        <div className="w-full space-y-4">
          <PostSkeletonList count={3} />
        </div>
      );
    }
    if (error) {
      return (
        <div className="my-16 text-center space-y-3 p-8 rounded-2xl bg-card/40 border border-border/60 max-w-md mx-auto">
          <p className="text-destructive text-sm font-medium">Failed to load posts feed.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </Button>
        </div>
      );
    }
    if (!data || !data.getPosts || !data.getPosts.posts?.length) {
      return (
        <div className="my-20 text-center space-y-3 p-8 rounded-2xl bg-card/40 border border-border/60 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
            <Compass className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No posts yet</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Be the first person to share an update with the community!
          </p>
        </div>
      );
    }
    return data.getPosts.posts.map((post: any) => (
      <PostDisplay key={post.id} post={post} />
    ));
  };

  return (
    <div className="flex-1 flex overflow-hidden h-screen bg-background">
      {/* Center Feed Column */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Sticky Header with feed tabs */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/60 px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setFeedTab("forYou")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                feedTab === "forYou"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setFeedTab("following")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                feedTab === "following"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Following
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Refresh feed"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </header>

        {/* Posts Stream */}
        <div className="w-full max-w-[640px] mx-auto py-6 px-3 md:px-4 space-y-5 flex flex-col items-center pb-24 md:pb-12">
          {renderPosts()}
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSideBar />
    </div>
  );
}

export default MainPage;
