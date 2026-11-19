"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { useQuery } from '@apollo/client/react';
import { GET_NOTIFICATIONS } from '@/graphql/queries/notification/getNotifications';
import { Bell, X, MessageSquare, Heart, UserPlus, Trash2, LogIn } from 'lucide-react';
import { formatRelative } from '@/lib/utils';

interface NotificationsPopUpProps {
  setShowPopup: (value: boolean) => void;
  setIsCollapsed: (value: boolean) => void;
}

type NotificationItem = {
  id: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actor?: { id: string; firstname: string; lastname?: string; avatarUrl?: string } | null;
  recipient?: { id: string; firstname: string; lastname?: string; avatarUrl?: string } | null;
  post?: { id: string; content: string; images?: { id: string; url: string }[] } | null;
  comment?: { id: string; content: string } | null;
  reaction?: { id: string; type: string } | null;
};

function formatTitle(n: NotificationItem) {
  const actorName = [n.actor?.firstname, n.actor?.lastname].filter(Boolean).join(' ') || 'Someone';
  switch (n.type) {
    case 'COMMENT_ON_POST':
      return `${actorName} commented on your post`;
    case 'REPLY_ON_COMMENT':
      return `${actorName} replied to your comment`;
    case 'REACTION_ON_POST':
      return `${actorName} reacted to your post`;
    case 'NEW_FOLLOWER':
      return `${actorName} started following you`;
    case 'POST_DELETED':
      return `Your post was removed`;
    case 'LOGIN':
      return `New login to your account`;
    default:
      return `Notification from ${actorName}`;
  }
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'COMMENT_ON_POST':
    case 'REPLY_ON_COMMENT':
      return <MessageSquare className="h-3 w-3 text-sky-400" />;
    case 'REACTION_ON_POST':
      return <Heart className="h-3 w-3 text-rose-400" />;
    case 'NEW_FOLLOWER':
      return <UserPlus className="h-3 w-3 text-emerald-400" />;
    case 'POST_DELETED':
      return <Trash2 className="h-3 w-3 text-destructive" />;
    default:
      return <Bell className="h-3 w-3 text-primary" />;
  }
}

function NotificationsPopUp({ setShowPopup, setIsCollapsed }: NotificationsPopUpProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, loading, fetchMore } = useQuery<{ notifications: NotificationItem[] }>(GET_NOTIFICATIONS, {
    variables: { take: 10 },
    notifyOnNetworkStatusChange: true,
  });

  const list = data?.notifications ?? [];
  const lastCursor = list.length > 0 ? list[list.length - 1].id : undefined;

  const handleScroll = () => {
    if (!scrollRef.current || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      if (lastCursor) {
        fetchMore({
          variables: { take: 10, cursor: lastCursor },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              notifications: [...prev.notifications, ...fetchMoreResult.notifications],
            };
          },
        });
      }
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold tracking-tight text-foreground">Notifications</h2>
        </div>
        <button
          onClick={() => { setShowPopup(false); setIsCollapsed(false); }}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto space-y-2 pr-1">
        {/* Loading skeleton */}
        {loading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/30 animate-pulse">
            <div className="w-9 h-9 bg-muted/40 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="w-36 h-3 bg-muted/40 rounded" />
              <div className="w-24 h-2.5 bg-muted/30 rounded" />
            </div>
          </div>
        ))}

        {/* Items */}
        {!loading && list.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-150 relative group ${
              n.isRead
                ? "hover:bg-secondary/40 text-muted-foreground"
                : "bg-primary/5 hover:bg-primary/10 border border-primary/20 text-foreground"
            }`}
          >
            <div className="relative shrink-0">
              <Image
                src={n.actor?.avatarUrl || '/noAvatar.png'}
                alt={n.actor?.firstname || 'actor'}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
              />
              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-card ring-1 ring-border shadow-xs">
                {getNotificationIcon(n.type)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground leading-snug">
                {formatTitle(n)}
              </p>
              {(n.post?.content || n.comment?.content) && (
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                  &ldquo;{n.post?.content || n.comment?.content}&rdquo;
                </p>
              )}
              <span className="text-[10px] text-muted-foreground/75 font-mono mt-1 block">
                {formatRelative(n.createdAt)}
              </span>
            </div>

            {!n.isRead && (
              <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1 shadow-xs shadow-primary/50" />
            )}
          </div>
        ))}

        {!loading && list.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-xs space-y-1">
            <Bell className="h-6 w-6 mx-auto opacity-30 mb-2" />
            <p className="font-semibold text-foreground">All caught up</p>
            <p>No new notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPopUp;
