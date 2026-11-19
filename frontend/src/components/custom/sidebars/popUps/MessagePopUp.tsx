"use client";

import type { ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, MessageSquare, X } from "lucide-react";

import Searching, { MessageSkeletonList } from "./Searching";
import { useUserChatrooms } from "@/hooks/chatroom/useUserChatrooms";
import { userMessageStore } from "@/store/messageStore";
import { useGeneralStore } from "@/store/generalStore";
import { formatRelative } from "@/lib/utils";
import { ChatroomMeta, ChatroomListItem, DEFAULT_AVATAR } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CreateGroupModal } from "../../../modal/CreateGroupModal";
import { useUserPresence } from "@/hooks/message/useUserPresence";

interface MessagePopUpProps {
  setShowPopup: (value: boolean) => void;
  setIsCollapsed: (value: boolean) => void;
}

function MessagePopUp({ setShowPopup, setIsCollapsed }: MessagePopUpProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { chatrooms, isInitialLoading, error, refetch } = useUserChatrooms();
  const setSelectedChatRoomId = userMessageStore((state) => state.setSelectedChatRoomId);
  const setSelectedChatroomMeta = userMessageStore((state) => state.setSelectedChatroomMeta);
  const [isCreateGroupOpen, setCreateGroupOpen] = useState(false);
  const { isMobile } = useGeneralStore();

  const directUserIds = useMemo(
    () =>
      chatrooms
        .filter((room) => !room.isGroup && room.otherUserId)
        .map((room) => room.otherUserId as string),
    [chatrooms]
  );

  const initialLastSeen = useMemo(() => {
    const snapshot: Record<string, string | null> = {};
    chatrooms.forEach((room) => {
      if (room.isGroup || !room.otherUserId) return;
      snapshot[room.otherUserId] = room.otherUserLastSeenAt ?? null;
    });
    return snapshot;
  }, [chatrooms]);

  const presence = useUserPresence({ userIds: directUserIds, initialLastSeen });

  const toChatroomMeta = useCallback(
    (room: ChatroomListItem | undefined): ChatroomMeta | null => {
      if (!room) return null;
      return {
        id: room.id,
        isGroup: room.isGroup,
        name: room.name,
        avatarUrl: room.avatarUrl ?? DEFAULT_AVATAR,
        subtitle: room.isGroup ? "Group chat" : "Direct message",
        otherUserId: room.otherUserId ?? null,
        otherUserLastSeenAt: room.otherUserLastSeenAt ?? null,
        isOnline: undefined,
        lastSeenAt: room.otherUserLastSeenAt ?? null,
      };
    },
    []
  );

  const handleOpenChatroom = useCallback(
    (chatroomId: string, routeId: string, meta?: ChatroomMeta | null) => {
      setSelectedChatRoomId(chatroomId);
      const baseRoom = chatrooms.find((room) => room.id === chatroomId);
      let resolvedMeta = meta ?? toChatroomMeta(baseRoom);

      if (resolvedMeta && !resolvedMeta.isGroup) {
        const otherId = resolvedMeta.otherUserId ?? baseRoom?.otherUserId ?? null;
        const presenceState = otherId ? presence[otherId] : undefined;
        resolvedMeta = {
          ...resolvedMeta,
          otherUserId: otherId,
          otherUserLastSeenAt: baseRoom?.otherUserLastSeenAt ?? resolvedMeta.otherUserLastSeenAt ?? null,
          isOnline: presenceState?.isOnline ?? resolvedMeta.isOnline ?? false,
          lastSeenAt:
            presenceState?.lastSeenAt ??
            resolvedMeta.lastSeenAt ??
            baseRoom?.otherUserLastSeenAt ??
            null,
        };
      }

      if (resolvedMeta) {
        setSelectedChatroomMeta(resolvedMeta);
      }
      if (isMobile) {
        setShowPopup(false);
        setIsCollapsed(true);
      } else {
        setShowPopup(true);
        setIsCollapsed(true);
      }
      router.push(`/message/${routeId}`);
    },
    [chatrooms, isMobile, presence, router, setIsCollapsed, setSelectedChatRoomId, setSelectedChatroomMeta, setShowPopup, toChatroomMeta]
  );

  const handleGroupCreated = useCallback(
    async (chatroomId: string) => {
      await refetch();
      handleOpenChatroom(chatroomId, chatroomId);
    },
    [handleOpenChatroom, refetch]
  );

  const renderChatroomList = () => {
    if (isInitialLoading) {
      return <MessageSkeletonList count={5} />;
    }

    if (error) {
      return (
        <div className="space-y-3 py-8 text-center">
          <p className="text-muted-foreground text-xs">Couldn&apos;t load conversations.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { void refetch(); }}
            className="text-xs"
          >
            Try again
          </Button>
        </div>
      );
    }

    if (chatrooms.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground text-xs space-y-1">
          <MessageSquare className="h-6 w-6 mx-auto opacity-30 mb-2" />
          <p className="font-semibold text-foreground">No conversations yet</p>
          <p>Search for a connection to start messaging.</p>
        </div>
      );
    }

    const directMessages = chatrooms.filter((chatroom) => !chatroom.isGroup);
    const groupChats = chatrooms.filter((chatroom) => chatroom.isGroup);

    const renderSection = (
      title: string,
      rooms: typeof chatrooms,
      emptyState: string,
      action?: ReactNode
    ) => (
      <div className="flex h-1/2 flex-col">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </h3>
            {action}
          </div>
          <span className="text-[11px] font-mono text-muted-foreground/70 bg-secondary/80 px-1.5 py-0.5 rounded-full">
            {rooms.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-xs text-muted-foreground/70">
              {emptyState}
            </div>
          ) : (
            <div className="space-y-1.5 pr-1">
              {rooms.map((chatroom) => {
                const lastMessage = chatroom.lastMessage;
                const lastMessagePreview = lastMessage
                  ? lastMessage.content?.trim()
                    ? lastMessage.content.trim()
                    : lastMessage.imageUrl
                    ? "Sent an image"
                    : "New chat"
                  : "Start the conversation";
                const timestamp = lastMessage?.createdAt
                  ? formatRelative(lastMessage.createdAt)
                  : "";
                const chatroomMeta = toChatroomMeta(chatroom);
                const isDirect = !chatroom.isGroup;
                const otherUserId = isDirect ? chatroom.otherUserId ?? null : null;
                const presenceState = otherUserId ? presence[otherUserId] : undefined;
                const isOnline = Boolean(presenceState?.isOnline);
                const lastSeen = presenceState?.lastSeenAt ?? chatroom.otherUserLastSeenAt ?? null;
                const lastSeenLabel = !isOnline && lastSeen ? formatRelative(lastSeen) : null;

                return (
                  <button
                    key={chatroom.id}
                    type="button"
                    onClick={() => handleOpenChatroom(chatroom.id, chatroom.routeId, chatroomMeta)}
                    className="flex w-full items-center justify-between rounded-xl p-2.5 text-left transition-all duration-150 hover:bg-secondary/50 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative h-9 w-9 shrink-0">
                        <Image
                          src={chatroom.avatarUrl}
                          alt={chatroom.name}
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
                        />
                        {isDirect && isOnline && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {chatroom.name}
                          </p>
                          {timestamp && (
                            <span className="text-[10px] text-muted-foreground/75 font-mono shrink-0">
                              {timestamp}
                            </span>
                          )}
                        </div>
                        {isDirect && (
                          <p className="text-[10px] text-emerald-400 font-medium">
                            {isOnline ? "Online" : lastSeenLabel ? `Seen ${lastSeenLabel}` : ""}
                          </p>
                        )}
                        <p className="line-clamp-1 text-[11px] text-muted-foreground">
                          {lastMessagePreview}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div className="flex h-full flex-col gap-5">
        {renderSection("Direct Messages", directMessages, "No direct messages yet.")}
        {renderSection(
          "Group Chats",
          groupChats,
          "No group chats yet.",
          (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setCreateGroupOpen(true)}
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="sr-only">Create group chat</span>
            </Button>
          )
        )}
      </div>
    );
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold tracking-tight text-foreground">Messages</h2>
        </div>
        <Link href="/">
          <button
            onClick={() => {
              setShowPopup(false);
              setIsCollapsed(false);
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </Link>
      </div>
      <Searching
        scrollRef={scrollRef}
        defaultContent={<>{renderChatroomList()}</>}
      />
      <CreateGroupModal
        open={isCreateGroupOpen}
        onOpenChange={setCreateGroupOpen}
        onCreated={handleGroupCreated}
      />
    </div>
  );
}

export default MessagePopUp;
