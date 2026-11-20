"use client";

import React, { use } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_POST } from "@/graphql/queries/post/GetPost";
import { PostDisplay } from "@/components/shared/PostDisplay";
import { PostSkeletonList } from "@/components/shared/skeleton/PostSkeleton";
import { ArrowLeft, Lock, FileQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RightSideBar from "@/components/custom/sidebars/RightSideBar";
import { useRouter } from "next/navigation";

interface PostPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function PostPage({ params }: PostPageProps) {
  const resolvedParams = "then" in params ? use(params as Promise<{ id: string }>) : params;
  const { id } = resolvedParams;
  const router = useRouter();

  const { data, loading, error, refetch } = useQuery<any>(GET_POST, {
    variables: { postId: id },
    fetchPolicy: "cache-and-network",
    skip: !id,
  });

  const post = data?.getPost;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="w-full max-w-[620px] mx-auto py-8">
          <PostSkeletonList count={1} />
        </div>
      );
    }

    if (error) {
      const isPrivateError =
        error.message?.toLowerCase().includes("private") ||
        (error as { graphQLErrors?: Array<{ message?: string }> })?.graphQLErrors?.some((e) =>
          e.message?.toLowerCase().includes("private")
        );

      if (isPrivateError) {
        return (
          <div className="my-20 text-center space-y-4 p-8 rounded-2xl bg-card/60 border border-border/80 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Private Post</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
              This post is from a private account. Only approved followers can view this content.
            </p>
            <Link href="/">
              <Button variant="outline" size="sm" className="mt-2 gap-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Feed
              </Button>
            </Link>
          </div>
        );
      }

      return (
        <div className="my-20 text-center space-y-4 p-8 rounded-2xl bg-card/60 border border-border/80 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
            <FileQuestion className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Post Unavailable</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            This post could not be found or may have been deleted by the author.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
            <Link href="/">
              <Button size="sm">Back to Feed</Button>
            </Link>
          </div>
        </div>
      );
    }

    if (!post) {
      return (
        <div className="my-20 text-center space-y-4 p-8 rounded-2xl bg-card/60 border border-border/80 max-w-md mx-auto">
          <p className="text-sm text-muted-foreground">Post not found.</p>
          <Link href="/">
            <Button variant="outline" size="sm">
              Return Home
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="w-full max-w-[620px] mx-auto py-6">
        <PostDisplay
          post={post}
          onDelete={() => {
            router.push("/");
          }}
        />
      </div>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden h-screen bg-background">
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/60 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Back to feed"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-sm font-bold text-foreground">Post</h1>
          </div>
        </header>

        <div className="px-3 md:px-4 pb-20">{renderContent()}</div>
      </div>

      <RightSideBar />
    </div>
  );
}
