"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Smile, Image as ImageIcon, Send, X, Loader2 } from "lucide-react";
import { EmojiPicker } from "@ferrucc-io/emoji-picker";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/store/userStore";
import { CREATE_MESSAGE } from "@/graphql/mutations/message/CreateMessage";
import {
  ChatHeaderSkeleton,
  EmptyState,
  MessagesSkeleton,
} from "@/components/shared/skeleton/MessagePageSkeleton";
import { useMessageComposer } from "@/hooks/message/useMessageComposer";
import { useMessagesBetweenUsers } from "@/hooks/message/useMessagesBetweenUsers";
import { Avatar, ChatHeader, MessageBubble } from "@/components/custom/message/MessagePageCommponents";
import { useTypping } from "@/hooks/message/useTypping";
import { ChatroomDetailModal } from "@/components/modal/ChatroomDetailModal";
import { userMessageStore } from "@/store/messageStore";
import type { MessageEdge } from "@/lib/types";
import { useUserPresence } from "@/hooks/message/useUserPresence";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

type PendingMessageState = {
  id: string;
  content: string;
  imagePreview: string | null;
  progress: number | null;
};

const PendingMessageBubble = ({
  message,
  userName,
  avatarUrl,
}: {
  message: PendingMessageState;
  userName: string;
  avatarUrl?: string | null;
}) => (
  <div className="flex items-start justify-start gap-3 opacity-80">
    <Avatar src={avatarUrl} alt={`${userName} avatar`} />
    <div className="max-w-lg rounded-2xl border border-white/10 bg-emerald-500/10 p-4 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">{userName}</p>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Sending…</span>
        </div>
      </div>
      {message.content && (
        <p className="mt-2 whitespace-pre-wrap text-sm text-white/90">{message.content}</p>
      )}
      {message.imagePreview && (
        <div
          className="relative mt-3 w-full overflow-hidden rounded-lg border border-white/10"
          style={{ minHeight: 200 }}
        >
          <img
            src={message.imagePreview}
            alt="Uploading attachment"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-xs">
              {message.progress !== null
                ? `Uploading… ${Math.round(message.progress)}%`
                : "Uploading…"}
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function MessagePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { user } = useUserStore();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const selectedChatroomMeta = userMessageStore((state) => state.selectedChatroomMeta);
  const setSelectedChatroomMeta = userMessageStore((state) => state.setSelectedChatroomMeta);
  const [pendingMessage, setPendingMessage] = useState<PendingMessageState | null>(null);
  const pendingMessageIdRef = useRef<string | null>(null);

  const scrollToBottom = useCallback(
    (behavior: "auto" | "smooth" = "smooth") => {
      const container = scrollContainerRef.current;
      if (!container) return;

      requestAnimationFrame(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior,
        });
      });
    },
    []
  );

  const {
    sortedMessages,
    chatroomId,
    addMessage,
    loading,
    error,
    chatroomMeta,
  } = useMessagesBetweenUsers({
    otherUserId: id,
    limit: 50,
    currentUserId: user?.id ?? null,
    skip: !user,
  });

  const [sendMessage, { loading: sending }] = useMutation(CREATE_MESSAGE);

  const activeChatroomMeta = chatroomMeta?.id ? chatroomMeta : selectedChatroomMeta ?? chatroomMeta;
  const isGroupChat = activeChatroomMeta?.isGroup ?? false;
  const directUserId = !isGroupChat ? activeChatroomMeta?.otherUserId ?? id : null;

  const presenceMap = useUserPresence({
    userIds: directUserId ? [directUserId] : [],
    initialLastSeen:
      directUserId && (activeChatroomMeta?.lastSeenAt ?? activeChatroomMeta?.otherUserLastSeenAt)
        ? {
            [directUserId]:
              activeChatroomMeta?.lastSeenAt ?? activeChatroomMeta?.otherUserLastSeenAt ?? null,
          }
        : {},
  });

  const otherUserPresence = directUserId ? presenceMap[directUserId] : undefined;

  const headerMeta = useMemo(() => {
    if (!activeChatroomMeta) {
      return activeChatroomMeta;
    }

    if (isGroupChat) {
      return {
        ...activeChatroomMeta,
        isOnline: undefined,
        lastSeenAt: activeChatroomMeta.lastSeenAt ?? null,
      };
    }

    return {
      ...activeChatroomMeta,
      isOnline: otherUserPresence?.isOnline ?? false,
      lastSeenAt:
        otherUserPresence?.lastSeenAt ??
        activeChatroomMeta.lastSeenAt ??
        activeChatroomMeta.otherUserLastSeenAt ??
        null,
    };
  }, [activeChatroomMeta, isGroupChat, otherUserPresence]);

  const handleMessageSent = useCallback(
    (message: MessageEdge) => {
      setPendingMessage((current) => {
        if (current && current.id === pendingMessageIdRef.current) {
          return null;
        }
        return current;
      });
      pendingMessageIdRef.current = null;
      addMessage(message);
    },
    [addMessage],
  );

  const handleComposerError = useCallback(() => {
    setPendingMessage(null);
    pendingMessageIdRef.current = null;
  }, []);

  const {
    messageInput,
    handleInputChange,
    handleSendMessage,
    handleEmojiSelect,
    toggleEmojiPicker,
    showEmojiPicker,
    canSend,
    textareaRef,
    emojiWrapperRef,
    selectedImage,
    handleFileChange,
    clearSelectedImage,
    uploadProgress,
    isUploading,
    fileInputRef,
    openFilePicker,
  } = useMessageComposer({
    chatroomId,
    otherUserId: directUserId ?? id,
    currentUserId: user?.id ?? null,
    isGroupChat,
    isSending: sending,
    sendMessage,
    onMessageSent: handleMessageSent,
    onError: handleComposerError,
  });

  const { typingUsers, handleUserStartedTyping, handleUserStoppedTyping } = useTypping(
    chatroomId,
    user?.id ?? null
  );

  const isSending = sending || isUploading;

  useEffect(() => {
    if (!pendingMessage?.imagePreview) return;
    if (uploadProgress === null) return;

    setPendingMessage((current) => {
      if (!current || !current.imagePreview) return current;
      if (current.progress === uploadProgress) return current;
      return { ...current, progress: uploadProgress };
    });
  }, [pendingMessage, uploadProgress]);

  useEffect(() => {
    if (!headerMeta?.id) {
      return;
    }

    if (
      selectedChatroomMeta &&
      selectedChatroomMeta.id === headerMeta.id &&
      selectedChatroomMeta.isOnline === headerMeta.isOnline &&
      selectedChatroomMeta.lastSeenAt === headerMeta.lastSeenAt
    ) {
      return;
    }

    setSelectedChatroomMeta(headerMeta);
  }, [headerMeta, selectedChatroomMeta, setSelectedChatroomMeta]);

  const detailChatroomId = chatroomId ?? (isGroupChat ? id : null);
  const detailOtherUserId = isGroupChat ? undefined : directUserId ?? id;
  const headerProps = headerMeta ?? activeChatroomMeta ?? null;

  useEffect(() => {
    if (loading) return;
    const behavior = sortedMessages.length <= 1 ? "auto" : "smooth";
    scrollToBottom(behavior);
  }, [loading, scrollToBottom, sortedMessages]);

  const handleSendMessageWithPending = useCallback(async () => {
    if (!canSend) return;

    const pendingId = `pending-${Date.now()}`;
    const trimmedContent = messageInput.trim();

    pendingMessageIdRef.current = pendingId;

    setPendingMessage({
      id: pendingId,
      content: trimmedContent,
      imagePreview: selectedImage?.preview ?? null,
      progress: selectedImage ? 0 : null,
    });

    scrollToBottom("smooth");

    const success = await handleSendMessage();
    await handleUserStoppedTyping();

    setPendingMessage((current) => {
      if (!current || current.id !== pendingId) return current;
      return null;
    });

    if (pendingMessageIdRef.current === pendingId) {
      pendingMessageIdRef.current = null;
    }

    if (!success) {
      return;
    }
  }, [canSend, handleSendMessage, handleUserStoppedTyping, messageInput, scrollToBottom, selectedImage]);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Sign in to view your messages.
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        <div className="sticky top-0 z-20 border-b border-border/70 bg-card/75 backdrop-blur-md">
          {loading ? (
            <ChatHeaderSkeleton />
          ) : headerProps ? (
            <ChatHeader
              {...headerProps}
              onShowDetail={() => setDetailOpen(true)}
            />
          ) : null}
        </div>
        <div ref={scrollContainerRef} className="flex flex-1 overflow-y-auto flex-col">
          <div className="flex-1 px-4 md:px-8 py-6">
            {loading && <MessagesSkeleton />}
            {!loading && error && (
              <div className="flex h-full items-center justify-center text-center text-xs text-destructive">
                Failed to load messages. Please try again later.
              </div>
            )}
            {!loading && !error && (sortedMessages.length > 0 || pendingMessage) && (
              <div className="flex flex-col gap-3">
                {sortedMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.user?.id === user.id}
                  />
                ))}
                {pendingMessage && (
                  <PendingMessageBubble
                    key={pendingMessage.id}
                    message={pendingMessage}
                    userName={user.firstname}
                    avatarUrl={user.avatarUrl}
                  />
                )}
              </div>
            )}
            {!loading && !error && sortedMessages.length === 0 && !pendingMessage && (
              <EmptyState />
            )}
            {typingUsers.length > 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                </span>
                <span>
                  {typingUsers.map((u) => u.firstname).join(", ")}{" "}
                  {typingUsers.length === 1 ? "is" : "are"} typing...
                </span>
              </div>
            )}
            <div className="h-4" />
          </div>
          <div className="sticky bottom-0 z-20 border-t border-border/70 bg-card/85 backdrop-blur-md px-4 py-3 sm:px-6">
            {selectedImage && (
              <div className="mb-3 flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-secondary/50 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-lg border border-border bg-black/60">
                    <img
                      src={selectedImage.preview}
                      alt="Selected attachment"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSelectedImage}
                  aria-label="Remove image"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center flex-1">
                <Textarea
                  ref={textareaRef}
                  value={messageInput}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    handleUserStartedTyping();
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (canSend) {
                        void handleSendMessageWithPending();
                      } else {
                        void handleUserStoppedTyping();
                      }
                    }
                  }}
                  onBlur={() => {
                    void handleUserStoppedTyping();
                  }}
                  placeholder="Write a message…"
                  rows={1}
                  className="min-h-[42px] max-h-32 resize-none bg-secondary/40 border-border/70 text-foreground placeholder:text-muted-foreground/60 text-sm rounded-xl py-2.5 pl-3.5 pr-20 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={openFilePicker}
                    disabled={isSending}
                    aria-label="Attach image"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <div ref={emojiWrapperRef} className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={toggleEmojiPicker}
                      aria-label="Add emoji"
                      aria-expanded={showEmojiPicker}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    {showEmojiPicker && (
                      <div
                        className="absolute bottom-full right-0 z-50 mb-3 w-64 max-w-xs overflow-y-auto rounded-2xl border border-border bg-card p-3 shadow-2xl backdrop-blur sm:w-72"
                        style={{ maxHeight: "60vh" }}
                        data-theme="dark"
                      >
                        <EmojiPicker
                          className="border-0 bg-transparent text-foreground"
                          emojiSize={24}
                          emojisPerRow={8}
                          onEmojiSelect={handleEmojiSelect}
                        >
                          <EmojiPicker.Header className="pb-2">
                            <EmojiPicker.Input
                              placeholder="Search emoji"
                              className="w-full rounded-md border border-border bg-secondary px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </EmojiPicker.Header>
                          <EmojiPicker.Group>
                            <EmojiPicker.List
                              hideStickyHeader
                              containerHeight={240}
                            />
                          </EmojiPicker.Group>
                        </EmojiPicker>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => {
                  void handleSendMessageWithPending();
                }}
                disabled={!canSend}
                size="icon"
                className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90 disabled:opacity-50"
                aria-label="Send message"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {uploadProgress !== null && isUploading && (
              <p className="mt-2 text-xs text-muted-foreground font-mono">
                Uploading attachment… {uploadProgress}%
              </p>
            )}
          </div>
        </div>
      </div>
      <ChatroomDetailModal
        open={isDetailOpen}
        onOpenChange={setDetailOpen}
        chatroomId={detailChatroomId}
        otherUserId={detailOtherUserId}
        meta={headerProps ?? undefined}
      />
    </div>
  );
}
