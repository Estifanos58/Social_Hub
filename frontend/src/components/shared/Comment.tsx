import Image from "next/image";

export const Comment = ({ comment }: { comment: any }) => {
  return (
    <div className="flex space-x-3 text-foreground">
      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border shrink-0">
        <Image
          src={comment.user?.avatar || "/noAvatar.png"}
          alt="avatar"
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
      <div>
        <p className="text-xs">
          <span className="font-semibold text-foreground">{comment.user?.name}</span>{" "}
          <span className="text-muted-foreground">@{comment.user?.username}</span>
        </p>
        <p className="mt-1 text-xs text-foreground/90">{comment.content}</p>

        {/* Replies */}
        {comment.replies && (
          <div className="ml-8 mt-2 space-y-2 border-l border-border/60 pl-3">
            {comment.replies.map((reply: any) => (
              <div key={reply.id} className="flex space-x-2.5">
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-border shrink-0">
                  <Image
                    src={reply.user?.avatar || "/noAvatar.png"}
                    alt="avatar"
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs">
                    <span className="font-semibold text-foreground">{reply.user?.name}</span>{" "}
                    <span className="text-muted-foreground">
                      @{reply.user?.username}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-foreground/80">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
