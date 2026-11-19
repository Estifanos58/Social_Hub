"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Smile,
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

export const ReactionBar: React.FC<ReactionBarProps> = ({
  post,
  onCommentClick,
  showCommentButton = true,
  disabled = false,
  className = "",
}) => {
  const ReactionList: ReactionOption[] = [
    { name: "Like", type: "LIKE", icon: <FaThumbsUp className="h-4 w-4" />, color: "text-blue-400" },
    { name: "Love", type: "LOVE", icon: <FaHeart className="h-4 w-4" />, color: "text-rose-500" },
    { name: "Haha", type: "HAHA", icon: <FaLaughSquint className="h-4 w-4" />, color: "text-amber-400" },
    { name: "Wow", type: "WOW", icon: <FaSurprise className="h-4 w-4" />, color: "text-orange-400" },
    { name: "Sad", type: "SAD", icon: <FaSadTear className="h-4 w-4" />, color: "text-sky-400" },
  ];

  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<ReactionOption | null>(null);
  const [localReactionCount, setLocalReactionCount] = useState<number>(post.reactionsCount || 0);
  const [isPersisting, setIsPersisting] = useState(false);

  const lastCommittedReactionRef = useRef<ReactionOption | null>(null);
  const pendingReactionRef = useRef<ReactionOption | null>(null);
  const debounceTimerRef = useRef<any>(null);
  const hideTimerRef = useRef<any>(null);
  const originalCountRef = useRef<number>(post.reactionsCount || 0);

  const [addReaction] = useMutation(ADD_REACTION_MUTATION);
  const [removeReaction] = useMutation(REMOVE_REACTION_MUTATION);

  const rollback = () => {
    const committed = lastCommittedReactionRef.current;
    setSelectedReaction(committed);
    setLocalReactionCount(originalCountRef.current);
  };

  const commitState = (newReaction: ReactionOption | null) => {
    lastCommittedReactionRef.current = newReaction;
  };

  const persistReactionChange = async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (disabled) return;
    const uiReaction = pendingReactionRef.current;
    const serverReaction = lastCommittedReactionRef.current;
    try {
      setIsPersisting(true);
      if (!serverReaction && uiReaction) {
        await addReaction({ variables: { postId: post.id, type: uiReaction.type } });
        commitState(uiReaction);
        originalCountRef.current += 1;
        return;
      }
      if (serverReaction && !uiReaction) {
        await removeReaction({ variables: { postId: post.id } });
        commitState(null);
        originalCountRef.current = Math.max(0, originalCountRef.current - 1);
        return;
      }
      if (serverReaction && uiReaction && serverReaction.type !== uiReaction.type) {
        await removeReaction({ variables: { postId: post.id } });
        await addReaction({ variables: { postId: post.id, type: uiReaction.type } });
        commitState(uiReaction);
        return;
      }
    } catch (e) {
      rollback();
    } finally {
      setIsPersisting(false);
      setLocalReactionCount(originalCountRef.current);
      setSelectedReaction(lastCommittedReactionRef.current);
    }
  };

  useEffect(() => {
    if (post.userReaction) {
      const found = ReactionList.find((r) => r.type === post.userReaction) || null;
      setSelectedReaction(found || null);
      lastCommittedReactionRef.current = found || null;
    } else {
      setSelectedReaction(null);
      lastCommittedReactionRef.current = null;
    }
    originalCountRef.current = post.reactionsCount || 0;
    setLocalReactionCount(post.reactionsCount || 0);
  }, [post.id, post.userReaction, post.reactionsCount]);

  const schedulePersist = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      persistReactionChange();
    }, 1500);
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
      navigator.clipboard.writeText(window.location.origin + `/#post-${post.id}`);
      toast.success("Post link copied to clipboard!");
    }
  };

  return (
    <div className={`flex items-center justify-between text-muted-foreground text-xs relative ${className}`}>
      <div className="flex items-center gap-1">
        {/* Reaction Trigger with Popover */}
        <div
          className="relative"
          onMouseEnter={openReactions}
          onMouseLeave={scheduleCloseReactions}
        >
          <button
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer ${
              selectedReaction
                ? "bg-primary/10 text-primary"
                : "hover:bg-secondary/60 hover:text-foreground"
            } ${isPersisting ? "opacity-75" : ""}`}
            aria-label={selectedReaction ? `${selectedReaction.name} reaction` : "Add reaction"}
            disabled={isPersisting || disabled}
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
              {ReactionList.map((reaction) => {
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
                    onClick={() => {
                      if (isPersisting || disabled) return;
                      setSelectedReaction((prev) => {
                        if (prev && prev.type === reaction.type) {
                          setLocalReactionCount((c) => Math.max(0, c - 1));
                          pendingReactionRef.current = null;
                          schedulePersist();
                          scheduleCloseReactions();
                          return null;
                        }
                        if (!prev) {
                          setLocalReactionCount((c) => c + 1);
                          pendingReactionRef.current = reaction;
                          schedulePersist();
                          scheduleCloseReactions();
                          return reaction;
                        }
                        pendingReactionRef.current = reaction;
                        schedulePersist();
                        scheduleCloseReactions();
                        return reaction;
                      });
                    }}
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
