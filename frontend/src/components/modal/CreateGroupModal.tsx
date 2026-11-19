"use client";

import Image from "next/image";
import { Loader2, ImagePlus, Trash2, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateGroupChat } from "@/hooks/chatroom/useCreateGroupChat";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (chatroomId: string) => Promise<void> | void;
}

export function CreateGroupModal({ open, onOpenChange, onCreated }: CreateGroupModalProps) {
  const {
    groupName,
    handleGroupNameChange,
    isSubmitting,
    canSubmit,
    handleSubmit,
    selectedImage,
    handleFileChange,
    clearSelectedImage,
    progress,
    isUploading,
    fileInputRef,
    openFilePicker,
  } = useCreateGroupChat({
    isOpen: open,
    onClose: () => onOpenChange(false),
    onCreated,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 border-border/80 text-foreground backdrop-blur-md rounded-2xl sm:max-w-md p-6 shadow-2xl" showCloseButton>
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader className="pb-2 border-b border-border/60">
            <div className="flex items-center gap-2 text-primary mb-1">
              <Users className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Create Group Chat
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Name your group and choose a group avatar to get started.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="group-name" className="text-xs font-medium text-foreground/80">
                Group Name
              </Label>
              <Input
                id="group-name"
                placeholder="e.g. Design Squad, Weekend Plans..."
                value={groupName}
                onChange={handleGroupNameChange}
                maxLength={60}
                className="bg-secondary/40 border-border/70 text-foreground placeholder:text-muted-foreground/60 rounded-xl h-10 text-sm focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground/80">
                Group Avatar (Optional)
              </Label>
              {selectedImage ? (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border/70 bg-secondary/30">
                  <div className="h-14 w-14 overflow-hidden rounded-xl border border-border shrink-0">
                    <Image
                      src={selectedImage.preview}
                      alt="Selected avatar"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSelectedImage}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-8"
                    disabled={isUploading || isSubmitting}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Remove
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={openFilePicker}
                  disabled={isUploading || isSubmitting}
                  className="w-full justify-center border-dashed border-border/80 bg-secondary/20 hover:bg-secondary/50 text-foreground text-xs h-10 rounded-xl"
                >
                  <ImagePlus className="mr-2 h-4 w-4 text-muted-foreground" />
                  Upload Photo
                </Button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {progress !== null && isUploading && (
                <p className="text-[11px] text-muted-foreground font-mono">
                  Uploading avatar… {progress}%
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-lg text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!canSubmit || isSubmitting || isUploading}
              className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium px-4"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Group"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
