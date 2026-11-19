"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, X } from "lucide-react";
import Image from "next/image";

interface MessageImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl?: string | null;
  senderName?: string | null;
  messageId?: string;
}

export const MessageImageModal = ({
  open,
  onOpenChange,
  imageUrl,
  senderName,
  messageId,
}: MessageImageModalProps) => {
  if (!imageUrl) {
    return null;
  }

  const filename = messageId ? `message-${messageId}` : "message-image";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-4xl overflow-hidden border border-border/80 bg-card/95 p-0 text-foreground lg:max-w-5xl rounded-2xl shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <p className="text-xs font-semibold text-foreground">
            {senderName ? `${senderName}'s attachment` : "Image preview"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-border/80 bg-secondary/50 text-foreground hover:bg-secondary rounded-xl text-xs h-8"
            >
              <a
                href={imageUrl}
                download={filename}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save</span>
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Close image preview"
              className="text-muted-foreground hover:text-foreground h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative flex items-center justify-center bg-black/90 p-4">
          <div className="relative h-[65vh] w-full max-w-full flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={senderName ? `Sent by ${senderName}` : "Message attachment"}
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-contain rounded-lg"
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
