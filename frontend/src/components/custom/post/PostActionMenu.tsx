"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Bookmark,
  Flag,
  EyeOff,
  Link2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { EDIT_POST_MUTATION } from "@/graphql/mutations/post/EditPost";
import { DELETE_POST_MUTATION } from "@/graphql/mutations/post/DeletePost";
import {
  SAVE_POST_MUTATION,
  UNSAVE_POST_MUTATION,
} from "@/graphql/mutations/post/SavePost";
import { REPORT_POST_MUTATION } from "@/graphql/mutations/post/ReportPost";
import { NOT_INTERESTED_POST_MUTATION } from "@/graphql/mutations/post/NotInterestedPost";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PostActionMenuProps {
  post: {
    id: string;
    content: string;
    createdById?: string;
    createdBy?: {
      id: string;
    };
    isSaved?: boolean;
  };
  onDelete?: (postId: string) => void;
  onEditSuccess?: (newContent: string) => void;
  onHide?: (postId: string) => void;
}

export const PostActionMenu: React.FC<PostActionMenuProps> = ({
  post,
  onDelete,
  onEditSuccess,
  onHide,
}) => {
  const { user: currentUser } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const [editContent, setEditContent] = useState(post.content);
  const [reportReason, setReportReason] = useState("Spam");
  const [isSaved, setIsSaved] = useState(Boolean(post.isSaved));

  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = Boolean(
    currentUser?.id &&
      (post.createdById === currentUser.id ||
        post.createdBy?.id === currentUser.id),
  );

  const [editPost, { loading: editLoading }] = useMutation(EDIT_POST_MUTATION);
  const [deletePost, { loading: deleteLoading }] =
    useMutation(DELETE_POST_MUTATION);
  const [savePost, { loading: saveLoading }] = useMutation(SAVE_POST_MUTATION);
  const [unsavePost, { loading: unsaveLoading }] =
    useMutation(UNSAVE_POST_MUTATION);
  const [reportPost, { loading: reportLoading }] =
    useMutation(REPORT_POST_MUTATION);
  const [notInterestedPost, { loading: notInterestedLoading }] = useMutation(
    NOT_INTERESTED_POST_MUTATION,
  );

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleCopyLink = () => {
    setMenuOpen(false);
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/post/${post.id}`;
      navigator.clipboard.writeText(url);
      toast.success("Post link copied to clipboard!");
    }
  };

  const handleToggleSave = async () => {
    setMenuOpen(false);
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);

    try {
      if (nextSaved) {
        await savePost({ variables: { postId: post.id } });
        toast.success("Post saved to bookmarks!");
      } else {
        await unsavePost({ variables: { postId: post.id } });
        toast.success("Post removed from bookmarks.");
      }
    } catch (err: any) {
      setIsSaved(!nextSaved);
      toast.error(err?.message || "Failed to update saved status");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    try {
      await editPost({
        variables: { postId: post.id, content: editContent.trim() },
      });
      setEditDialogOpen(false);
      onEditSuccess?.(editContent.trim());
      toast.success("Post updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to edit post");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePost({ variables: { postId: post.id } });
      setDeleteDialogOpen(false);
      onDelete?.(post.id);
      toast.success("Post deleted successfully.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete post");
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await reportPost({
        variables: { postId: post.id, reason: reportReason },
      });
      setReportDialogOpen(false);
      toast.success("Report submitted. Thank you for keeping SocialHub safe.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit report");
    }
  };

  const handleNotInterested = async () => {
    setMenuOpen(false);
    try {
      await notInterestedPost({ variables: { postId: post.id } });
      onHide?.(post.id);
      toast.success("Post hidden. We will show fewer posts like this.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update preference");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer"
        aria-label="Post options"
        aria-expanded={menuOpen}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-card border border-border/80 shadow-xl shadow-black/40 py-1.5 z-40 text-xs backdrop-blur-md animate-[fadeIn_100ms_ease-out]">
          {/* Owner Actions */}
          {isOwner && (
            <>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setEditContent(post.content);
                  setEditDialogOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-foreground/90 hover:bg-secondary/70 hover:text-foreground transition-colors text-left cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-primary" />
                <span>Edit Post</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setDeleteDialogOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Post</span>
              </button>
              <div className="my-1 border-t border-border/60" />
            </>
          )}

          {/* Non-owner Actions */}
          {!isOwner && (
            <>
              <button
                type="button"
                onClick={handleNotInterested}
                disabled={notInterestedLoading}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-foreground/90 hover:bg-secondary/70 hover:text-foreground transition-colors text-left cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Not Interested</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setReportDialogOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Post</span>
              </button>
              <div className="my-1 border-t border-border/60" />
            </>
          )}

          {/* General Actions */}
          <button
            type="button"
            onClick={handleToggleSave}
            disabled={saveLoading || unsaveLoading}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-foreground/90 hover:bg-secondary/70 hover:text-foreground transition-colors text-left cursor-pointer"
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                isSaved ? "fill-primary text-primary" : "text-muted-foreground"
              }`}
            />
            <span>{isSaved ? "Saved" : "Save Post"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-foreground/90 hover:bg-secondary/70 hover:text-foreground transition-colors text-left cursor-pointer"
          >
            <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Copy Link</span>
          </button>
        </div>
      )}

      {/* Edit Post Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Pencil className="w-4 h-4 text-primary" />
              Edit Post
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl bg-secondary/40 border border-border/70 text-foreground text-sm focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary resize-none placeholder:text-muted-foreground"
              placeholder="What's happening?"
              maxLength={2000}
            />
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditDialogOpen(false)}
                disabled={editLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={editLoading || !editContent.trim()}
                className="gap-2"
              >
                {editLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Post Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Delete Post
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground py-2 leading-relaxed">
            Are you sure you want to delete this post? This action cannot be undone and will remove it from feeds and profiles.
          </p>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="gap-2"
            >
              {deleteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Post Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Flag className="w-4 h-4 text-destructive" />
              Report Post
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReportSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                Select a reason:
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-secondary/50 border border-border/70 text-foreground text-xs focus:outline-hidden focus:border-primary cursor-pointer"
              >
                <option value="Spam">Spam or misleading content</option>
                <option value="Harassment">Harassment or bullying</option>
                <option value="Inappropriate">Inappropriate or offensive media</option>
                <option value="Hate Speech">Hate speech or discrimination</option>
                <option value="Violence">Violence or dangerous behavior</option>
                <option value="Other">Other reason</option>
              </select>
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setReportDialogOpen(false)}
                disabled={reportLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                disabled={reportLoading}
                className="gap-2"
              >
                {reportLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Submit Report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
