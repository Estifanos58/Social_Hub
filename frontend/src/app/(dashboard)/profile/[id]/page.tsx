"use client";

import { use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Globe, Grid3X3, Heart, Lock, MessageCircle, Edit, Mail } from "lucide-react";
import Link from "next/link";
import { useProfilePage } from "../../../../hooks/user/useProfilePage";

type ProfilePageProps = {
  params: Promise<{
    id: string;
  }> | { id: string };
};

export default function ProfilePage({ params }: ProfilePageProps) {
  // Support both Next.js 15 async params and regular params
  const resolvedParams = "then" in params ? use(params as Promise<{ id: string }>) : params;
  const { id } = resolvedParams;

  const {
    loading,
    error,
    profile,
    account,
    hoveredPost,
    setHoveredPost,
    isPrivate,
    handleSelectPost,
    currentUser,
  } = useProfilePage(id);

  if (loading) {
    return (
      <div className="min-h-screen flex-1 bg-background flex items-center justify-center text-foreground">
        <div className="flex flex-col items-center gap-3 text-muted-foreground text-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex-1 bg-background flex items-center justify-center text-destructive">
        <div className="p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-center max-w-sm">
          <p className="text-sm font-semibold">Failed to load profile</p>
          <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!profile || !account) {
    return (
      <div className="min-h-screen flex-1 bg-background flex items-center justify-center text-muted-foreground">
        <p className="text-sm">User profile could not be found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex-1 overflow-y-auto text-foreground">
      <div className="max-w-4xl mx-auto p-4 md:p-6 pb-20">
        {/* Cover Banner */}
        <div className="h-36 md:h-52 w-full rounded-2xl bg-gradient-to-r from-neutral-900 via-stone-900 to-neutral-950 border border-border/80 relative overflow-hidden shadow-xs">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(245,158,11,0.08),_transparent_60%)]" />
        </div>

        {/* Profile Card Header */}
        <div className="relative px-2 md:px-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 md:-mt-20 mb-4">
            <div className="flex items-end gap-4">
              <Avatar className="w-28 h-28 md:w-36 md:h-36 rounded-2xl ring-4 ring-background border-2 border-border shadow-2xl shrink-0">
                <AvatarImage
                  src={account.avatarUrl || "/noAvatar.png"}
                  alt={`${account.firstname} ${account.lastname || ""}`}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-bold bg-secondary text-foreground">
                  {account.firstname?.[0]?.toUpperCase()}
                  {account.lastname?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="mb-1 hidden md:block">
                <h1 className="font-extrabold text-2xl tracking-tight text-foreground flex items-center gap-2">
                  {account.firstname} {account.lastname || ""}
                </h1>
                <p className="text-xs text-muted-foreground font-mono">
                  @{account.firstname?.toLowerCase()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              {currentUser && id === currentUser.id ? (
                <Link href="/profile/edit">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-9 px-4 text-xs font-semibold gap-2 border-border/80 hover:bg-secondary/70"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Profile
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>

          {/* Mobile Name Display */}
          <div className="block md:hidden mb-3">
            <h1 className="font-bold text-xl text-foreground">
              {account.firstname} {account.lastname || ""}
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              @{account.firstname?.toLowerCase()}
            </p>
          </div>

          {/* Bio & Details */}
          <div className="space-y-3 max-w-xl">
            {account.bio ? (
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {account.bio}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">No bio provided yet.</p>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              {account.email && (
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  {account.email}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                {isPrivate ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    Private Account
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    Public Profile
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-8 mt-5 py-3 border-y border-border/60">
            <div>
              <span className="font-bold text-base text-foreground font-mono">
                {profile.posts?.length || 0}
              </span>
              <span className="text-xs text-muted-foreground ml-1.5 font-medium">Posts</span>
            </div>
            <div>
              <span className="font-bold text-base text-foreground font-mono">
                {profile.followers || 0}
              </span>
              <span className="text-xs text-muted-foreground ml-1.5 font-medium">Followers</span>
            </div>
            <div>
              <span className="font-bold text-base text-foreground font-mono">
                {profile.following || 0}
              </span>
              <span className="text-xs text-muted-foreground ml-1.5 font-medium">Following</span>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex justify-center border-b border-border/70 mb-4">
          <button className="flex items-center gap-2 text-primary border-b-2 border-primary pb-3 px-4 text-xs font-bold tracking-wider uppercase cursor-pointer">
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Posts</span>
          </button>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {profile.posts?.map((post: any) => (
            <div
              key={post.id}
              onClick={() => handleSelectPost(post)}
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-secondary/30 transition-all duration-200"
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt={`Post ${post.id}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {hoveredPost === post.id && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center space-x-6 transition-opacity duration-200">
                  <div className="flex items-center text-white font-semibold text-sm">
                    <Heart className="w-4 h-4 mr-1.5 fill-white" />
                    {post.likes || 0}
                  </div>
                  <div className="flex items-center text-white font-semibold text-sm">
                    <MessageCircle className="w-4 h-4 mr-1.5 fill-white" />
                    {post.comments || 0}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {profile.posts?.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-xs space-y-2">
            <Grid3X3 className="h-8 w-8 mx-auto opacity-30" />
            <p className="font-semibold text-foreground">No posts published yet</p>
            <p>Updates shared by this user will be featured here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
