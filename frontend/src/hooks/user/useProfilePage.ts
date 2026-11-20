import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_USER_PROFILE } from "@/graphql/queries/user/getUserProfile";
import { useUserStore } from "@/store/userStore";
import { GetUserProfileQuery } from "@/gql/graphql";
import { useGeneralStore } from "@/store/generalStore";
import { FOLLOW_USER } from "@/graphql/mutations/user/FollowUser";
import { UNFOLLOW_USER } from "@/graphql/mutations/user/UnfollowUser";
import { CANCEL_FOLLOW_REQUEST } from "@/graphql/mutations/user/CancelFollowRequest";
import { CREATE_CHATROOM } from "@/graphql/mutations/message/CreateChatroom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useProfilePage = (userId?: string) => {
  const router = useRouter();
  const { user: currentUser } = useUserStore();
  const { setSelectedPost } = useGeneralStore();
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  const effectiveUserId = userId ?? currentUser?.id;
  const { data, loading, error, refetch } = useQuery<GetUserProfileQuery>(
    GET_USER_PROFILE,
    {
      variables: { userId: effectiveUserId },
      fetchPolicy: "cache-and-network",
      skip: !effectiveUserId,
    },
  );

  const profile = data?.GetUser;
  const account = profile?.user;

  // Fix: synchronize privacy status with loaded account
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [followStatus, setFollowStatus] = useState<string>("NONE");
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  useEffect(() => {
    if (account) {
      setIsPrivate(Boolean(account.isPrivate));
      const status =
        (profile as any)?.followStatus ||
        account.followStatus ||
        (account.isFollowing ? "ACCEPTED" : "NONE");
      setFollowStatus(status);
    }
    if (profile) {
      setFollowersCount(profile.followers ?? 0);
      setFollowingCount(profile.following ?? 0);
    }
  }, [account, profile]);

  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [cancelFollowRequest] = useMutation(CANCEL_FOLLOW_REQUEST);
  const [createChatroom, { loading: messageLoading }] = useMutation(CREATE_CHATROOM);

  const isOwner = Boolean(
    currentUser?.id && effectiveUserId && currentUser.id === effectiveUserId,
  );

  const handleSelectPost = (post: any) => {
    setSelectedPost(post);
  };

  const handleFollowAction = async () => {
    if (!effectiveUserId || isOwner || isActionLoading) return;

    setIsActionLoading(true);
    const prevStatus = followStatus;
    const prevFollowers = followersCount;

    try {
      if (followStatus === "ACCEPTED") {
        // Unfollow
        setFollowStatus("NONE");
        setFollowersCount(Math.max(0, prevFollowers - 1));
        await unfollowUser({ variables: { followingId: effectiveUserId } });
        toast.success("Unfollowed successfully");
      } else if (followStatus === "PENDING") {
        // Cancel follow request
        setFollowStatus("NONE");
        await cancelFollowRequest({ variables: { followingId: effectiveUserId } });
        toast.success("Follow request cancelled");
      } else {
        // Follow / Request to follow
        if (isPrivate) {
          setFollowStatus("PENDING");
          await followUser({ variables: { followingId: effectiveUserId } });
          toast.success("Follow request sent");
        } else {
          setFollowStatus("ACCEPTED");
          setFollowersCount(prevFollowers + 1);
          await followUser({ variables: { followingId: effectiveUserId } });
          toast.success("Following user");
        }
      }
    } catch (err: any) {
      // Rollback
      setFollowStatus(prevStatus);
      setFollowersCount(prevFollowers);
      toast.error(err?.message || "Failed to update follow status");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleStartMessage = async () => {
    if (!effectiveUserId || isOwner) return;

    try {
      const { data } = await createChatroom({
        variables: {
          otherUserId: effectiveUserId,
          isGroupChat: false,
        },
      });

      const chatroomId = (data as any)?.createChatroomMutation;
      if (chatroomId) {
        router.push(`/message/${chatroomId}`);
      } else {
        router.push("/message");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to start conversation");
      router.push("/message");
    }
  };

  return {
    loading,
    error,
    refetch,
    profile,
    account,
    hoveredPost,
    setHoveredPost,
    isPrivate,
    setIsPrivate,
    followStatus,
    followersCount,
    followingCount,
    isActionLoading,
    messageLoading,
    isOwner,
    handleFollowAction,
    handleStartMessage,
    handleSelectPost,
    currentUser,
  };
};
