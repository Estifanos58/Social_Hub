"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import {
  FaThumbsUp,
  FaLaughSquint,
  FaSadTear,
  FaSurprise,
  FaHeart,
} from "react-icons/fa";
import { useMutation } from "@apollo/client/react";
import { ADD_REACTION_MUTATION } from "@/graphql/mutations/post/AddReaction";
import { REMOVE_REACTION_MUTATION } from "@/graphql/mutations/post/RemoveReaction";
import { toast } from "sonner";

interface ReactionBarProps {
  post: {
    id: string;
    reactionsCount?: number | null;
    userReaction?: string | null;
    commentsCount?: number | null;
  };
  onCommentClick?: () => void;
  showCommentButton?: boolean;
  disabled?: boolean;
  className?: string;
}

interface ReactionOption {
  name: string;
  type: string;
  icon: React.ReactNode;
  color: string;
}

const REACTION_OPTIONS: ReactionOption[] = [
  { name: "Like", type: "LIKE", icon: <FaThumbsUp className="h-4 w-4" />, color: "text-blue-400" },
  { name: "Love", type: "LOVE", icon: <FaHeart className="h-4 w-4" />, color: "text-rose-500" },
  { name: "Haha", type: "HAHA", icon: <FaLaughSquint className="h-4 w-4" />, color: "text-amber-400" },
  { name: "Wow", type: "WOW", icon: <FaSurprise className="h-4 w-4" />, color: "text-orange-400" },
  { name: "Sad", type: "SAD", icon: <FaSadTear className="h-4 w-4" />, color: "text-sky-400" },
];

export const ReactionBar: React.FC<ReactionBarProps> = ({
  post,
  onCommentClick,
  showCommentButton = true,
  disabled = false,
  className = "",
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<ReactionOption | null>(() => {
    return REACTION_OPTIONS.find((r) => r.type === post.userReaction) || null;
  });
  const [localReactionCount, setLocalReactionCount] = useState<number>(post.reactionsCount || 0);
  const [isMutating, setIsMutating] = useState(false);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [addReaction] = useMutation(ADD_REACTION_MUTATION);
  const [removeReaction] = useMutation(REMOVE_REACTION_MUTATION);

  // Sync when post prop updates from external queries
  useEffect(() => {
    const found = REACTION_OPTIONS.find((r) => r.type === post.userReaction) || null;
    setSelectedReaction(found);
    setLocalReactionCount(post.reactionsCount ?? 0);
  }, [post.id, post.userReaction, post.reactionsCount]);

  const handleSelectReaction = async (reaction: ReactionOption) => {
    if (disabled || isMutating) return;

    setShowReactions(false);
    const prevReaction = selectedReaction;
    const prevCount = localReactionCount;

    // Determine target state
    const isRemoving = prevReaction?.type === reaction.type;
    const nextReaction = isRemoving ? null : reaction;
    let nextCount = prevCount;

    if (!prevReaction && nextReaction) {
      nextCount = prevCount + 1;
    } else if (prevReaction && !nextReaction) {
      nextCount = Math.max(0, prevCount - 1);
    } // Changing reaction keeps count same

    // Optimistic update
    setSelectedReaction(nextReaction);
    setLocalReactionCount(nextCount);
    setIsMutating(true);

    try {
      if (isRemoving) {
        await removeReaction({
          variables: { postId: post.id },
          optimisticResponse: { removeReaction: true },
        });
      } else {
        await addReaction({
          variables: { postId: post.id, type: reaction.type },
          optimisticResponse: { addReaction: true },
        });
      }
    } catch (err: any) {
      // Rollback on failure
      setSelectedReaction(prevReaction);
      setLocalReactionCount(prevCount);
      toast.error(err?.message || "Failed to update reaction");
    } finally {
      setIsMutating(false);
    }
  };

  const handleQuickToggleLike = () => {
    if (selectedReaction) {
      // If already reacted, toggle it off
      handleSelectReaction(selectedReaction);
    } else {
      // Default to "Like"
      handleSelectReaction(REACTION_OPTIONS[0]);
    }
  };

  const openReactions = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowReactions(true);
  };

  const scheduleCloseReactions = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowReactions(false), 250);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/post/${post.id}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Post link copied to clipboard!");
    }
  };

  return (
    <div className={`flex items-center justify-between text-muted-foreground text-xs relative select-none ${className}`}>
      <div className="flex items-center gap-1">
        {/* Reaction Trigger with Popover */}
        <div
          className="relative"
          onMouseEnter={openReactions}
          onMouseLeave={scheduleCloseReactions}
        >
          <button
            onClick={handleQuickToggleLike}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer ${
              selectedReaction
                ? "bg-primary/10 text-primary"
                : "hover:bg-secondary/60 hover:text-foreground"
            } ${isMutating ? "opacity-80" : ""}`}
            aria-label={selectedReaction ? `${selectedReaction.name} reaction` : "Add reaction"}
            disabled={disabled}
            type="button"
          >
            <span className="flex items-center justify-center">
              {selectedReaction ? (
                selectedReaction.icon
              ) : (
                <Heart className="h-4 w-4" />
              )}
            </span>
            <span className="font-semibold text-xs">{localReactionCount}</span>
          </button>

          {showReactions && (
            <div
              className="absolute z-30 bottom-full left-0 mb-2 flex items-center bg-card/95 border border-border/80 rounded-2xl shadow-xl shadow-black/50 p-1.5 gap-1 backdrop-blur-md animate-[fadeIn_120ms_ease-out]"
              onMouseEnter={openReactions}
              onMouseLeave={scheduleCloseReactions}
            >
              {REACTION_OPTIONS.map((reaction) => {
                const isSelected = selectedReaction?.type === reaction.type;
                return (
                  <button
                    key={reaction.name}
                    className={`p-2 rounded-xl transition-all duration-150 cursor-pointer ${
                      reaction.color
                    } ${
                      isSelected
                        ? "bg-secondary scale-110 shadow-xs"
                        : "hover:bg-secondary hover:scale-115"
                    }`}
                    onClick={() => handleSelectReaction(reaction)}
                    type="button"
                    aria-label={reaction.name}
                    title={reaction.name}
                  >
                    {reaction.icon}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Comment Button */}
        {showCommentButton && (
          <button
            onClick={onCommentClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium hover:bg-secondary/60 hover:text-foreground transition-all duration-150 cursor-pointer"
            aria-label="Open comments"
            disabled={disabled}
            type="button"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="font-semibold text-xs">{post.commentsCount ?? 0}</span>
          </button>
        )}
      </div>

      {/* Share / Copy link */}
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium hover:bg-secondary/60 hover:text-foreground transition-all duration-150 cursor-pointer"
        aria-label="Share post"
        type="button"
        title="Share post"
      >
        <Share2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
