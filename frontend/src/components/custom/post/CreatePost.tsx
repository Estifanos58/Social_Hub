"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, Plus, Send, Loader2 } from "lucide-react";
import { useGeneralStore } from "@/store/generalStore";
import { useCreatePost } from "@/hooks/post/useCreatePost";

function CreatePost() {
  const { isCollapsed, isMobile } = useGeneralStore();
  const {
    images,
    content,
    setContent,
    isDragOver,
    isOpen,
    setIsOpen,
    fileInputRef,
    loading,
    isUploading,
    progressMap,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeImage,
    openFileDialog,
    handleSubmit,
  } = useCreatePost();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isMobile ? (
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Create post"
          >
            <Plus className="h-5 w-5" />
          </button>
        ) : isCollapsed ? (
          <Button
            size="icon"
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90"
            aria-label="Create post"
          >
            <Plus className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 flex items-center justify-center gap-2"
            aria-label="Create post"
          >
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[580px] bg-card/95 border-border/80 text-foreground backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        <DialogHeader className="pb-3 border-b border-border/60">
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
            Create a Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="content" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Share what&apos;s new
            </Label>
            <Textarea
              id="content"
              placeholder="What are you thinking about today?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] bg-secondary/40 border-border/70 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl resize-none p-3.5 text-sm"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Media Attachments
            </Label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFileDialog}
              className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragOver
                  ? "border-primary bg-primary/10"
                  : "border-border/80 hover:border-primary/50 bg-secondary/30 hover:bg-secondary/50"
              }`}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Drop images here, or <span className="text-primary hover:underline">browse files</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Supports PNG, JPG, GIF, WebP</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {images.map((image) => (
                  <div key={image.id} className="relative group rounded-xl overflow-hidden border border-border/60 aspect-video bg-secondary/50">
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {isUploading && progressMap[image.id] != null && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-3">
                        <div className="w-full space-y-1">
                          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${progressMap[image.id]}%` }}
                              className="h-full bg-primary transition-all duration-150"
                            />
                          </div>
                          <div className="text-[10px] text-white/90 text-center font-mono">
                            {progressMap[image.id]}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-border/60">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading || isUploading || !content.trim()}
              className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-5"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" />
                  Post
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
