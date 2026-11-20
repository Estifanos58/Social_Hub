"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_NOTIFICATIONS } from "@/graphql/queries/notification/getNotifications";
import { GET_UNREAD_NOTIFICATIONS_COUNT } from "@/graphql/queries/notification/getUnreadNotificationsCount";
import { MARK_NOTIFICATION_AS_READ } from "@/graphql/mutations/notification/MarkNotificationAsRead";
import { MARK_ALL_NOTIFICATIONS_AS_READ } from "@/graphql/mutations/notification/MarkAllNotificationsAsRead";
import { ACCEPT_FOLLOW_REQUEST } from "@/graphql/mutations/user/AcceptFollowRequest";
import { REJECT_FOLLOW_REQUEST } from "@/graphql/mutations/user/RejectFollowRequest";
import {
  Bell,
  X,
  MessageSquare,
  Heart,
  UserPlus,
  UserCheck,
  Trash2,
  Check,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { formatRelative } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const actorName = [n.actor?.firstname, n.actor?.lastname].filter(Boolean).join(" ") || "Someone";
  switch (n.type) {
    case "COMMENT_ON_POST":
      return `${actorName} commented on your post`;
    case "REPLY_ON_COMMENT":
      return `${actorName} replied to your comment`;
    case "REACTION_ON_POST":
      return `${actorName} reacted to your post`;
    case "NEW_FOLLOWER":
      return `${actorName} started following you`;
    case "FOLLOW_REQUEST":
      return `${actorName} requested to follow you`;
    case "FOLLOW_ACCEPTED":
      return `${actorName} accepted your follow request`;
    case "POST_DELETED":
      return `Your post was removed`;
    case "LOGIN":
      return `New login to your account`;
    default:
      return `Notification from ${actorName}`;
  }
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "COMMENT_ON_POST":
    case "REPLY_ON_COMMENT":
      return <MessageSquare className="h-3 w-3 text-sky-400" />;
    case "REACTION_ON_POST":
      return <Heart className="h-3 w-3 text-rose-400" />;
    case "NEW_FOLLOWER":
      return <UserPlus className="h-3 w-3 text-emerald-400" />;
    case "FOLLOW_REQUEST":
      return <UserPlus className="h-3 w-3 text-amber-500" />;
    case "FOLLOW_ACCEPTED":
      return <UserCheck className="h-3 w-3 text-emerald-400" />;
    case "POST_DELETED":
      return <Trash2 className="h-3 w-3 text-destructive" />;
    default:
      return <Bell className="h-3 w-3 text-primary" />;
  }
}

export default function NotificationsPopUp({ setShowPopup, setIsCollapsed }: NotificationsPopUpProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [localList, setLocalList] = useState<NotificationItem[]>([]);
  const [followActionState, setFollowActionState] = useState<Record<string, "accepted" | "rejected" | "loading">>({});

  const { data, loading, fetchMore, refetch } = useQuery<{ notifications: NotificationItem[] }>(
    GET_NOTIFICATIONS,
    {
      variables: { take: 15 },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    },
  );

  const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ, {
    refetchQueries: [{ query: GET_UNREAD_NOTIFICATIONS_COUNT }],
  });
  const [markAllNotificationsAsRead, { loading: markAllLoading }] = useMutation(
    MARK_ALL_NOTIFICATIONS_AS_READ,
    {
      refetchQueries: [{ query: GET_UNREAD_NOTIFICATIONS_COUNT }],
    },
  );
  const [acceptFollowRequest] = useMutation(ACCEPT_FOLLOW_REQUEST);
  const [rejectFollowRequest] = useMutation(REJECT_FOLLOW_REQUEST);

  useEffect(() => {
    if (data?.notifications) {
      setLocalList(data.notifications);
    }
  }, [data]);

  const unreadCount = localList.filter((n) => !n.isRead).length;

  const handleScroll = () => {
    if (!scrollRef.current || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const lastCursor = localList.length > 0 ? localList[localList.length - 1].id : undefined;
      if (lastCursor) {
        fetchMore({
          variables: { take: 15, cursor: lastCursor },
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

  const handleMarkOneAsRead = async (id: string) => {
    setLocalList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    try {
      await markNotificationAsRead({ variables: { id } });
    } catch {
      // Ignore background sync errors
    }
  };

  const handleMarkAllAsRead = async () => {
    setLocalList((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsAsRead();
      toast.success("All notifications marked as read");
      refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to mark all as read");
    }
  };

  const handleAcceptFollow = async (notificationId: string, actorId: string) => {
    setFollowActionState((prev) => ({ ...prev, [notificationId]: "loading" }));
    try {
      await acceptFollowRequest({ variables: { followerId: actorId } });
      await handleMarkOneAsRead(notificationId);
      setFollowActionState((prev) => ({ ...prev, [notificationId]: "accepted" }));
      toast.success("Follow request accepted");
    } catch (err: any) {
      setFollowActionState((prev) => {
        const copy = { ...prev };
        delete copy[notificationId];
        return copy;
      });
      toast.error(err?.message || "Failed to accept follow request");
    }
  };

  const handleRejectFollow = async (notificationId: string, actorId: string) => {
    setFollowActionState((prev) => ({ ...prev, [notificationId]: "loading" }));
    try {
      await rejectFollowRequest({ variables: { followerId: actorId } });
      await handleMarkOneAsRead(notificationId);
      setFollowActionState((prev) => ({ ...prev, [notificationId]: "rejected" }));
      toast.success("Follow request declined");
    } catch (err: any) {
      setFollowActionState((prev) => {
        const copy = { ...prev };
        delete copy[notificationId];
        return copy;
      });
      toast.error(err?.message || "Failed to decline follow request");
    }
  };

  return (
    <div className="p-4 h-full flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold tracking-tight text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground font-mono">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={markAllLoading}
              className="text-xs text-primary hover:underline font-medium cursor-pointer flex items-center gap-1"
              title="Mark all notifications as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setShowPopup(false);
              setIsCollapsed(false);
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-2 pr-1"
      >
        {/* Loading skeleton */}
        {loading && localList.length === 0 &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/30 animate-pulse"
            >
              <div className="w-9 h-9 bg-muted/40 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="w-36 h-3 bg-muted/40 rounded" />
                <div className="w-24 h-2.5 bg-muted/30 rounded" />
              </div>
            </div>
          ))}

        {/* Notification items */}
        {localList.map((n) => {
          const followState = followActionState[n.id];

          return (
            <div
              key={n.id}
              onClick={() => {
                if (!n.isRead) handleMarkOneAsRead(n.id);
              }}
              className={`flex flex-col p-3 rounded-xl transition-all duration-150 relative group cursor-pointer ${
                n.isRead
                  ? "hover:bg-secondary/40 text-muted-foreground"
                  : "bg-primary/5 hover:bg-primary/10 border border-primary/20 text-foreground"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <Image
                    src={n.actor?.avatarUrl || "/noAvatar.png"}
                    alt={n.actor?.firstname || "actor"}
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkOneAsRead(n.id);
                    }}
                    className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1 shadow-xs shadow-primary/50 hover:scale-150 transition-transform"
                    title="Mark as read"
                  />
                )}
              </div>

              {/* Follow Request Action Buttons */}
              {n.type === "FOLLOW_REQUEST" && n.actor?.id && (
                <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-end gap-2">
                  {followState === "accepted" ? (
                    <span className="text-xs text-primary font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Accepted
                    </span>
                  ) : followState === "rejected" ? (
                    <span className="text-xs text-muted-foreground font-medium">
                      Declined
                    </span>
                  ) : followState === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-3 text-xs rounded-lg cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectFollow(n.id, n.actor!.id);
                        }}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 px-3 text-xs rounded-lg cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptFollow(n.id, n.actor!.id);
                        }}
                      >
                        Accept
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {!loading && localList.length === 0 && (
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
