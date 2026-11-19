"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelative } from "@/lib/utils";
import { CommentSection } from "./CommentSection";
import { CollapsibleReplies } from "./CollapsibleReplies";
import { CreatedComment } from "@/hooks/comment/useCommentSection";
import { CornerDownRight } from "lucide-react";

export interface CommentNode {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string | null;
  replyCount?: number;
  createdBy: {
    id: string;
    firstname: string;
    lastname?: string;
    avatarUrl?: string;
  };
  replies?: CommentNode[];
}

interface CommentItemProps {
  comment: CommentNode;
  postId: string;
  depth?: number;
  onReplyAdded?: (parentId: string, reply: CreatedComment) => void;
  maxDepth?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  depth = 0,
  onReplyAdded,
  maxDepth = 2,
}) => {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className="flex gap-2.5 group/comment py-2">
      <Avatar className="w-7 h-7 shrink-0 ring-1 ring-border/60">
        <AvatarImage src={comment?.createdBy?.avatarUrl || "/noAvatar.png"} />
        <AvatarFallback className="bg-secondary text-foreground text-[10px] font-semibold">
          {(comment?.createdBy?.firstname?.[0] ?? "U").toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="rounded-xl bg-secondary/35 border border-border/50 px-3 py-2 text-foreground">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-xs text-foreground truncate">
              {comment?.createdBy?.firstname} {comment?.createdBy?.lastname || ""}
            </span>
            <span className="text-muted-foreground text-[10px] font-mono shrink-0">
              {formatRelative(comment?.createdAt)}
            </span>
          </div>
          <p className="text-xs text-foreground/90 mt-1 leading-relaxed whitespace-pre-wrap break-words">
            {comment?.content}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-1.5 pl-1">
          {depth < maxDepth && (
            <button
              className="text-muted-foreground text-[11px] font-medium hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
              onClick={() => setShowReply((s) => !s)}
              type="button"
            >
              <CornerDownRight className="w-3 h-3" />
              {showReply ? "Cancel" : "Reply"}
            </button>
          )}
        </div>

        {showReply && depth < maxDepth && (
          <div className="mt-2 pl-2 border-l-2 border-border/60">
            <CommentSection
              postId={postId}
              parentId={comment?.id}
              compact
              autoFocus
              placeholder="Write a reply..."
              onCreated={(created) => {
                onReplyAdded?.(comment?.id, created);
                setShowReply(false);
              }}
            />
          </div>
        )}

        {comment?.replies && comment?.replies.length > 0 && (
          <div className="mt-2 pl-2 border-l border-border/50 space-y-2">
            <CollapsibleReplies
              comment={comment}
              postId={postId}
              depth={depth}
              maxDepth={maxDepth}
              onReplyAdded={onReplyAdded}
            />
          </div>
        )}
      </div>
    </div>
  );
};
