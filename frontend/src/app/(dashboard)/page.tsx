"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import RightSideBar from "@/components/custom/sidebars/RightSideBar";
import { PostDisplay } from "@/components/shared/PostDisplay";
import { GET_POSTS } from "@/graphql/queries/post/GetPosts";
import { useQuery } from "@apollo/client/react";
import { PostSkeletonList } from "@/components/shared/skeleton/PostSkeleton";
import { Compass, RefreshCw, Users, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/types";

export default function MainPage() {
  const [feedTab, setFeedTab] = useState<"forYou" | "following">("forYou");
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  const { loading, data, error, refetch, fetchMore } = useQuery<any>(GET_POSTS, {
    variables: { take: 10, cursor: null, feedType: feedTab },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  // Reset and synchronize posts on query response or tab switch
  useEffect(() => {
    if (data?.getPosts?.posts) {
      setPosts(data.getPosts.posts);
      setHasMore(Boolean(data.getPosts.hasMore));
    }
  }, [data]);

  // Load next page of posts using cursor pagination
  const loadMore = useCallback(async () => {
    if (loading || isFetchingMore || !hasMore || posts.length === 0) return;

    const lastPost = posts[posts.length - 1];
    if (!lastPost?.id) return;

    setIsFetchingMore(true);
    try {
      const result = await fetchMore({
        variables: {
          take: 10,
          cursor: lastPost.id,
          feedType: feedTab,
        },
      });

      const newPosts: Post[] = result.data?.getPosts?.posts || [];
      const newHasMore = Boolean(result.data?.getPosts?.hasMore);

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const deduplicated = newPosts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...deduplicated];
      });
      setHasMore(newHasMore);
    } catch {
      // Failed to fetch more posts
    } finally {
      setIsFetchingMore(false);
    }
  }, [loading, isFetchingMore, hasMore, posts, fetchMore, feedTab]);

  // Setup infinite scroll intersection observer
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !isFetchingMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore, hasMore, loading, isFetchingMore]);

  const handleTabChange = (tab: "forYou" | "following") => {
    if (tab === feedTab) return;
    setFeedTab(tab);
    setPosts([]);
    setHasMore(true);
  };

  const handleRemovePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const renderContent = () => {
    if (loading && posts.length === 0) {
      return (
        <div className="w-full space-y-4">
          <PostSkeletonList count={3} />
        </div>
      );
    }

    if (error && posts.length === 0) {
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

    if (!loading && posts.length === 0) {
      if (feedTab === "following") {
        return (
          <div className="my-20 text-center space-y-3 p-8 rounded-2xl bg-card/40 border border-border/60 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No posts from accounts you follow</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
              When people you follow share posts, they will appear here. Find creators in Suggested Users to get started!
            </p>
          </div>
        );
      }

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

    return (
      <>
        {posts.map((post) => (
          <PostDisplay
            key={post.id}
            post={post}
            onDelete={handleRemovePost}
            onHide={handleRemovePost}
          />
        ))}

        {/* Infinite Scroll Sentinel */}
        <div ref={observerTarget} className="w-full py-4 flex justify-center">
          {isFetchingMore && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Loading more updates...</span>
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground/70 py-6">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>You&apos;re all caught up! No more posts.</span>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden h-screen bg-background">
      {/* Center Feed Column */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Sticky Header with feed tabs */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/60 px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/60">
            <button
              type="button"
              onClick={() => handleTabChange("forYou")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                feedTab === "forYou"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              For You
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("following")}
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
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Refresh feed"
              disabled={loading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </header>

        {/* Posts Stream */}
        <div className="w-full max-w-[640px] mx-auto py-6 px-3 md:px-4 space-y-5 flex flex-col items-center pb-24 md:pb-12">
          {renderContent()}
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSideBar />
    </div>
  );
}
