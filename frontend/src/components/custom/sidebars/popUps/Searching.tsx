'use client';

import { useMemo, useState } from "react";
import type { ChangeEvent, ReactNode, Ref } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@apollo/client/react";
import { SEARCH_USERS } from "@/graphql/queries/user/searchUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { userMessageStore } from "@/store/messageStore";
import { DEFAULT_AVATAR } from "@/lib/types";
import { formatBio } from "@/lib/utils";

interface SearchingProps {
  defaultContent: ReactNode;
  scrollRef?: Ref<HTMLDivElement>;
  placeholder?: string;
  limit?: number;
}

interface SearchUsersQueryData {
  SearchUsers: {
    hasMore: boolean;
    users: Array<{
      id: string;
      firstname: string;
      lastname: string | null;
      bio: string | null;
      email: string;
      avatarUrl: string | null;
    }>;
  };
}

interface SearchUsersQueryVariables {
  searchUsersInput: {
    searchTerm: string;
    limit?: number;
    offset?: number;
  };
}

export function MessageSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/30 animate-pulse"
        >
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-full bg-muted/40 shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="w-24 h-3 rounded bg-muted/40" />
              <div className="w-16 h-2.5 rounded bg-muted/30" />
            </div>
          </div>
          <div className="w-12 h-5 rounded-full bg-muted/30 shrink-0" />
        </div>
      ))}
    </div>
  );
}

function Searching({
  defaultContent,
  scrollRef,
  placeholder = "Search messages...",
  limit = 10,
}: SearchingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const router = useRouter();
  const setSelectedChatRoomId = userMessageStore((state) => state.setSelectedChatRoomId);
  const setSelectedChatroomMeta = userMessageStore((state) => state.setSelectedChatroomMeta);

  const shouldSkip = useMemo(() => debouncedSearchTerm.trim().length === 0, [
    debouncedSearchTerm,
  ]);

  const { data, loading, error } = useQuery<
    SearchUsersQueryData,
    SearchUsersQueryVariables
  >(SEARCH_USERS, {
    variables: {
      searchUsersInput: {
        searchTerm: debouncedSearchTerm.trim(),
        limit,
        offset: 0,
      },
    },
    skip: shouldSkip,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMessageRoute = (user: SearchUsersQueryData["SearchUsers"]["users"][number]) => {
    setSelectedChatRoomId(null);
    setSelectedChatroomMeta({
      id: null,
      isGroup: false,
      name: user.firstname,
      avatarUrl: user.avatarUrl ?? DEFAULT_AVATAR,
      subtitle: user.bio ?? "",
    });
    router.replace(`/message/${user.id}`);
  };

  const users = data?.SearchUsers?.users ?? [];
  const isSearching = !shouldSkip;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full bg-secondary/50 border border-border/70 text-foreground placeholder:text-muted-foreground/60 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {isSearching ? (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {loading && <MessageSkeletonList count={4} />}

          {error && !loading && (
            <div className="text-destructive text-center py-6 text-xs">
              Failed to search users. Please try again.
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="text-muted-foreground text-center py-8 text-xs">
              No users match your query.
            </div>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="space-y-1.5">
              {users.map((user) => (
                <div
                  onClick={() => handleMessageRoute(user)}
                  key={user.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <Image
                      src={user.avatarUrl || "/noAvatar.png"}
                      alt={user.firstname}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-border shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {user.firstname} {user.lastname ?? ""}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">{formatBio(user.bio)}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-primary/80 group-hover:text-primary px-2 py-0.5 rounded-full bg-primary/10 shrink-0">
                    Chat
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-2 pr-1"
        >
          {defaultContent}
        </div>
      )}
    </div>
  );
}

export default Searching;
