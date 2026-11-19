"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SelectedPost } from "@/store/generalStore";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ReactionBar } from "../shared/ReactionBar";
import React from "react";
import { CommentSkeletonList } from "../shared/skeleton/CommentSkeleton";
import { usePostDetailModal, sliderSettings } from "../../hooks/post/usePostDetailModal";
import { CommentItem } from "../custom/comment/CommentItem";
import { CommentSection } from "../custom/comment/CommentSection";
import Image from "next/image";

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: SelectedPost;
}

export function PostDetailModal({
  isOpen,
  onClose,
  post,
}: PostDetailModalProps) {
  const {
    resolvedPost,
    images,
    reactionSummary,
    createdAtLabel,
    isDetailsLoading,
    commentsWithLocalReplies,
    hasNextPage,
    loadMore,
    handleCommentAdded,
    handleReplyAdded,
    postId,
    showCommentsSkeleton,
    commentsLoading,
  } = usePostDetailModal(post);

  const createdBy = resolvedPost?.createdBy;
  const postContent = resolvedPost?.content ?? "";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="lg:max-w-5xl w-full h-[85vh] p-0 bg-card border border-border/80 text-foreground rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Left side - Media Gallery */}
          <div className="flex-1 bg-black/40 flex items-center justify-center overflow-hidden relative border-b md:border-b-0 md:border-r border-border/70">
            {isDetailsLoading && images.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground text-sm">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Loading preview...</span>
              </div>
            ) : images.length > 0 ? (
              <Slider {...sliderSettings} className="w-full max-w-[500px] h-full flex items-center">
                {images.map((img: any) => (
                  <div key={img.id ?? `image-${img.url}`} className="w-full h-full flex items-center justify-center p-4">
                    <img
                      src={img.url}
                      alt="post image"
                      className="max-h-[75vh] max-w-full object-contain rounded-xl mx-auto shadow-lg"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-muted-foreground text-sm">No media attached</div>
            )}
          </div>

          {/* Right side - Post details & Thread */}
          <div className="w-full md:w-[380px] lg:w-[420px] bg-card flex flex-col h-full shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/70">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="w-9 h-9 ring-1 ring-border shrink-0">
                  <AvatarImage
                    src={createdBy?.avatarUrl || "/noAvatar.png"}
                  />
                  <AvatarFallback className="bg-secondary text-foreground text-xs font-semibold">
                    {createdBy?.firstname?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-foreground font-semibold text-sm truncate">
                    {createdBy?.firstname} {createdBy?.lastname || ""}
                  </span>
                  <span className="text-muted-foreground text-xs truncate">
                    @{createdBy?.firstname?.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable comments stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Original post text */}
              {postContent && (
                <div className="flex gap-3 pb-4 border-b border-border/60">
                  <Avatar className="w-8 h-8 shrink-0 ring-1 ring-border/60">
                    <AvatarImage src={createdBy?.avatarUrl || "/noAvatar.png"} />
                    <AvatarFallback className="bg-secondary text-foreground text-xs">
                      {createdBy?.firstname?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-semibold text-xs">
                        {createdBy?.firstname}
                      </span>
                      <span className="text-muted-foreground text-[10px] font-mono">• {createdAtLabel}</span>
                    </div>
                    <p className="text-sm text-foreground/90 mt-1 whitespace-pre-wrap leading-relaxed break-words">
                      {postContent}
                    </p>
                  </div>
                </div>
              )}

              {/* Comments skeleton */}
              {showCommentsSkeleton && (
                <CommentSkeletonList count={4} />
              )}

              {/* Comments List */}
              {commentsWithLocalReplies.length > 0 && (
                <div className="space-y-3">
                  {commentsWithLocalReplies.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      postId={postId!}
                      onReplyAdded={handleReplyAdded}
                    />
                  ))}
                </div>
              )}

              {!commentsLoading && commentsWithLocalReplies.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-10">
                  No comments yet. Start the conversation!
                </div>
              )}

              {hasNextPage && (
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadMore()}
                    className="w-full text-xs text-muted-foreground hover:text-foreground"
                  >
                    Load older comments
                  </Button>
                </div>
              )}
            </div>

            {/* Reactions + Comments composer */}
            <div className="border-t border-border/70 p-4 space-y-3 bg-card/60 backdrop-blur-xs">
              <ReactionBar
                post={{
                  id: postId!,
                  reactionsCount: reactionSummary.reactionsCount,
                  userReaction: reactionSummary.userReaction,
                  commentsCount: reactionSummary.commentsCount,
                }}
                showCommentButton={false}
              />
              <CommentSection postId={postId!} onCreated={handleCommentAdded} compact />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
