"use client";

import type React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Send, Loader2 } from "lucide-react";
import { EmojiPicker } from "@ferrucc-io/emoji-picker";
import { CreatedComment, useCommentSection } from "@/hooks/comment/useCommentSection";

interface CommentSectionProps {
  postId: string;
  parentId?: string;
  onCreated?: (comment: CreatedComment) => void;
  autoFocus?: boolean;
  placeholder?: string;
  compact?: boolean;
}

export const CommentSection = ({
  postId,
  parentId,
  onCreated,
  autoFocus = false,
  placeholder = "Write a thoughtful comment...",
  compact = false,
}: CommentSectionProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    comment,
    setComment,
    showEmojiPicker,
    setShowEmojiPicker,
    isSubmitting,
    emojiPickerRef,
    handleEmojiSelect,
    handleSubmit,
    handleKeyDown,
  } = useCommentSection({ postId, parentId, onCreated });

  const adjustTextareaHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const max = 180;
    const newHeight = Math.min(el.scrollHeight, max);
    el.style.height = newHeight + "px";
  };

  return (
    <div
      className={
        (compact
          ? "mt-2 rounded-xl border border-border/60 bg-secondary/30 p-2.5"
          : "mt-4 rounded-xl border border-border/70 bg-secondary/40 p-3.5") +
        " text-foreground transition-all duration-150"
      }
    >
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative group">
            <Textarea
              ref={textareaRef}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                requestAnimationFrame(adjustTextareaHeight);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              autoFocus={autoFocus}
              className={
                (compact ? "min-h-[38px] text-xs py-2" : "min-h-[44px] text-sm py-2.5") +
                " leading-relaxed resize-none pr-10 bg-card/60 border border-border/60 hover:border-border focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 rounded-lg transition-all duration-150"
              }
              rows={1}
              style={{ overflowY: "auto" }}
            />
            <div className="absolute right-2 bottom-1.5 flex items-center">
              <div className="relative" ref={emojiPickerRef}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker((v) => !v)}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                  aria-label="Add emoji"
                  aria-haspopup="dialog"
                  aria-expanded={showEmojiPicker}
                >
                  <Smile className="h-4 w-4" />
                </Button>
                {showEmojiPicker && (
                  <div
                    className="absolute bottom-full right-0 mb-2 z-50 w-76 origin-bottom-right rounded-2xl border border-border bg-card shadow-2xl p-2 backdrop-blur-md animate-[fadeIn_120ms_ease-out]"
                    data-theme="dark"
                    role="dialog"
                    aria-label="Emoji picker"
                  >
                    <div className="max-h-72 overflow-y-auto pr-1">
                      <EmojiPicker
                        className="border border-border/60 bg-card rounded-xl text-foreground"
                        emojisPerRow={10}
                        emojiSize={26}
                        onEmojiSelect={handleEmojiSelect}
                      >
                        <EmojiPicker.Header className="p-1 pb-1.5">
                          <EmojiPicker.Input
                            placeholder="Search emoji..."
                            autoFocus={true}
                            className="rounded-lg bg-secondary placeholder:text-muted-foreground text-xs focus:ring-2 focus:ring-primary/40 focus:border-primary border border-border w-full px-2.5 py-1.5 text-foreground transition"
                          />
                        </EmojiPicker.Header>
                        <EmojiPicker.Group>
                          <EmojiPicker.List
                            hideStickyHeader={true}
                            containerHeight={300}
                          />
                        </EmojiPicker.Group>
                      </EmojiPicker>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {comment.trim() && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="sm"
              className="h-9 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium shadow-xs disabled:opacity-50 shrink-0"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <span className="flex items-center gap-1">
                  <Send className="h-3 w-3" />
                  Post
                </span>
              )}
            </Button>
          )}
        </div>
        {comment.trim() && !compact && (
          <div className="text-[10px] text-muted-foreground mt-1.5 pl-1 select-none font-mono">
            Press Cmd+Enter or Ctrl+Enter to publish
          </div>
        )}
      </div>
    </div>
  );
};
