import { useState } from "react";
import { DEFAULT_AVATAR, MessageEdge } from "@/lib/types";
import { Info, Check, CheckCheck } from "lucide-react";
import { formatEditedTime, formatRelative, formatTime } from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";
import { MessageImageModal } from "@/components/modal/MessageImageModal";
import { Button } from "../../ui/button";

export const Avatar = ({ src, alt }: { src?: string | null; alt: string }) => (
  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border/80 bg-secondary">
    <Image
      src={src || DEFAULT_AVATAR}
      alt={alt}
      fill
      sizes="36px"
      className="object-cover"
    />
  </div>
);

export const MessageBubble = ({ message, isOwn }: { message: MessageEdge; isOwn: boolean }) => {
  const [isImageOpen, setImageOpen] = useState(false);
  const editedLabel = formatEditedTime(message.createdAt, message.updatedAt);

  const bubble = (
    <div
      className={clsx(
        "max-w-md md:max-w-lg rounded-2xl p-3.5 text-sm transition-all duration-150",
        {
          "bg-primary text-primary-foreground shadow-xs rounded-tr-xs font-medium":
            isOwn,
          "bg-card/90 border border-border/70 text-foreground shadow-xs rounded-tl-xs":
            !isOwn,
        }
      )}
    >
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <p
          className={clsx("text-xs font-semibold", {
            "text-primary-foreground/95": isOwn,
            "text-foreground": !isOwn,
          })}
        >
          {message.user?.firstname ?? "User"}
        </p>
        <span
          className={clsx("text-[10px] font-mono", {
            "text-primary-foreground/75": isOwn,
            "text-muted-foreground": !isOwn,
          })}
        >
          {formatTime(message.createdAt)}
        </span>
      </div>

      {message.content && (
        <p className="whitespace-pre-wrap leading-relaxed text-[13px] break-words">
          {message.content}
        </p>
      )}

      {message.imageUrl && (
        <>
          <button
            type="button"
            onClick={() => setImageOpen(true)}
            className="group relative mt-2.5 block w-full overflow-hidden rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <span className="relative block min-h-[180px] md:min-h-[260px]">
              <Image
                src={message.imageUrl}
                alt="message attachment"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </span>
          </button>
          <MessageImageModal
            open={isImageOpen}
            onOpenChange={setImageOpen}
            imageUrl={message.imageUrl}
            senderName={message.user?.firstname}
            messageId={message.id}
          />
        </>
      )}

      {editedLabel && (
        <p
          className={clsx("mt-1.5 text-[10px] italic", {
            "text-white/60": isOwn,
            "text-muted-foreground": !isOwn,
          })}
        >
          {editedLabel}
        </p>
      )}
    </div>
  );

  return (
    <div
      className={clsx("flex items-end gap-2.5 my-1.5", {
        "flex-row-reverse": isOwn,
        "flex-row": !isOwn,
      })}
    >
      <Avatar src={message.user?.avatarUrl} alt={`${message.user?.firstname ?? "User"} avatar`} />
      <div
        className={clsx("flex flex-1", {
          "justify-end": isOwn,
          "justify-start": !isOwn,
        })}
      >
        {bubble}
      </div>
    </div>
  );
};

export const ChatHeader = ({
  isGroup,
  name,
  avatarUrl,
  subtitle,
  onShowDetail,
  disableDetailButton = false,
  isOnline,
  lastSeenAt,
}: {
  isGroup: boolean;
  name: string;
  avatarUrl?: string | null;
  subtitle?: string | null;
  onShowDetail?: () => void;
  disableDetailButton?: boolean;
  isOnline?: boolean;
  lastSeenAt?: string | null;
}) => (
  <header className="flex items-center justify-between gap-4 border-b border-border/70 bg-card/60 px-6 py-3.5 backdrop-blur-md shrink-0">
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/80 bg-secondary">
        <Image
          src={avatarUrl || DEFAULT_AVATAR}
          alt={name}
          fill
          sizes="40px"
          className="object-cover"
        />
        {!isGroup && isOnline && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500 shadow-xs" />
        )}
      </div>
      <div>
        <h2 className="text-sm font-bold tracking-tight text-foreground">{name}</h2>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          {!isGroup && isOnline ? (
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active now
            </span>
          ) : isGroup ? (
            subtitle ?? "Group chat"
          ) : lastSeenAt ? (
            `Active ${formatRelative(lastSeenAt)}`
          ) : (
            subtitle ?? "Offline"
          )}
        </p>
      </div>
    </div>
    {onShowDetail && (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onShowDetail}
        disabled={disableDetailButton}
        className="rounded-xl h-8 px-3 text-xs gap-1.5 border-border/80"
      >
        <Info className="h-3.5 w-3.5" />
        Details
      </Button>
    )}
  </header>
);
