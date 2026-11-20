/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

/** Types of Roles in the chat room */
export enum ChatRoomRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Moderator = 'MODERATOR',
  Owner = 'OWNER'
}

export type ChatroomDetailDto = {
  __typename?: 'ChatroomDetailDto';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  directUser?: Maybe<ChatroomDirectUserDto>;
  id: Scalars['String']['output'];
  isGroup: Scalars['Boolean']['output'];
  members?: Maybe<Array<ChatroomMemberDetailDto>>;
  name?: Maybe<Scalars['String']['output']>;
  totalMembers?: Maybe<Scalars['Int']['output']>;
  totalMessages: Scalars['Int']['output'];
  totalPhotos: Scalars['Int']['output'];
};

export type ChatroomDirectUserDto = {
  __typename?: 'ChatroomDirectUserDto';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstname?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastname?: Maybe<Scalars['String']['output']>;
  totalFollowers: Scalars['Int']['output'];
  totalFollowing: Scalars['Int']['output'];
};

export type ChatroomDto = {
  __typename?: 'ChatroomDto';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  isGroup: Scalars['Boolean']['output'];
  memberships?: Maybe<Array<ChatroomUserDto>>;
  messages?: Maybe<Array<MessageDto>>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ChatroomMemberDetailDto = {
  __typename?: 'ChatroomMemberDetailDto';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  firstname?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isOwner: Scalars['Boolean']['output'];
  lastname?: Maybe<Scalars['String']['output']>;
  userId: Scalars['String']['output'];
};

export type ChatroomUserDto = {
  __typename?: 'ChatroomUserDto';
  chatroom?: Maybe<ChatroomDto>;
  chatroomId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isMuted: Scalars['Boolean']['output'];
  joinedAt: Scalars['DateTime']['output'];
  lastReadAt?: Maybe<Scalars['DateTime']['output']>;
  role: ChatRoomRole;
  user?: Maybe<UserDto>;
  userId: Scalars['String']['output'];
};

export type CommentDto = {
  __typename?: 'CommentDto';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  parent?: Maybe<CommentDto>;
  parentId?: Maybe<Scalars['String']['output']>;
  post?: Maybe<PostDto>;
  postId: Scalars['String']['output'];
  replies?: Maybe<Array<CommentDto>>;
  repliesHasNextPage?: Maybe<Scalars['Boolean']['output']>;
  replyCount?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type CommentEdgeDto = {
  __typename?: 'CommentEdgeDto';
  cursor: Scalars['String']['output'];
  node: CommentDto;
};

export type CommentRepliesConnectionDto = {
  __typename?: 'CommentRepliesConnectionDto';
  edges: Array<CommentEdgeDto>;
  pageInfo: PageInfoDto;
  totalCount: Scalars['Int']['output'];
};

export type CreateCommentDto = {
  content: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
  postId: Scalars['String']['input'];
};

export type CreatePostDto = {
  content: Scalars['String']['input'];
  imageUrls?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type FollowerDto = {
  __typename?: 'FollowerDto';
  createdAt: Scalars['DateTime']['output'];
  follower?: Maybe<UserDto>;
  followerId: Scalars['String']['output'];
  following?: Maybe<UserDto>;
  followingId: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type GetChatUsersDto = {
  __typename?: 'GetChatUsersDto';
  chatroomId: Scalars['String']['output'];
  groupName?: Maybe<Scalars['String']['output']>;
  isGroup: Scalars['Boolean']['output'];
  latestMessage: MessageDto;
  otherUser?: Maybe<UserDto>;
};

export type GetChatUsersResponse = {
  __typename?: 'GetChatUsersResponse';
  chatrooms: Array<GetChatUsersDto>;
};

export type GetFollowersDto = {
  __typename?: 'GetFollowersDto';
  hasMore?: Maybe<Scalars['Boolean']['output']>;
  totalFollowers?: Maybe<Scalars['Float']['output']>;
  totalFollowing?: Maybe<Scalars['Float']['output']>;
  users?: Maybe<Array<UserDto>>;
};

export type GetFollowersInput = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type GetPostType = {
  __typename?: 'GetPostType';
  comments?: Maybe<Array<CommentDto>>;
  commentsCount: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  id: Scalars['String']['output'];
  images?: Maybe<Array<PostImageDto>>;
  isSaved?: Maybe<Scalars['Boolean']['output']>;
  reactions?: Maybe<Array<ReactionDto>>;
  reactionsCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userReaction?: Maybe<Scalars['String']['output']>;
};

export type GetUserChatroomsResponse = {
  __typename?: 'GetUserChatroomsResponse';
  chatrooms: Array<ChatroomDto>;
};

export type GetUsersToFollow = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type GetUsersToFollowDto = {
  __typename?: 'GetUsersToFollowDto';
  hasMore: Scalars['Boolean']['output'];
  users: Array<UserDto>;
};

export type LoginDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MessageDto = {
  __typename?: 'MessageDto';
  chatroom?: Maybe<ChatroomDto>;
  chatroomId: Scalars['String']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isEdited: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<UserDto>;
  userId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  UnfollowUser: Scalars['String']['output'];
  UpdateUser: UserDto;
  acceptFollowRequest: Scalars['String']['output'];
  addReaction: Scalars['Boolean']['output'];
  addUserToChatroomMutation: Array<Scalars['String']['output']>;
  cancelFollowRequest: Scalars['String']['output'];
  createChatroomMutation: Scalars['String']['output'];
  createComment: CommentDto;
  createMessageMutation: MessageDto;
  createPost: Scalars['String']['output'];
  deletePost: Scalars['String']['output'];
  editPost: PostDto;
  followUser: Scalars['String']['output'];
  forgotPassword: Scalars['String']['output'];
  login: UserResponse;
  logout: Scalars['String']['output'];
  markAllNotificationsAsRead: Scalars['Boolean']['output'];
  markNotificationAsRead: Scalars['Boolean']['output'];
  notInterestedPost: Scalars['Boolean']['output'];
  register: UserResponse;
  rejectFollowRequest: Scalars['String']['output'];
  removeReaction: Scalars['Boolean']['output'];
  reportPost: Scalars['Boolean']['output'];
  resetPassword: UserResponse;
  savePost: Scalars['Boolean']['output'];
  unsavePost: Scalars['Boolean']['output'];
  userStartedTypingMutation: UserDto;
  userStoppedTypingMutation: UserDto;
  verifyEmail: UserResponse;
};


export type MutationUnfollowUserArgs = {
  followingId: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  updateUser: UpdateUserDto;
};


export type MutationAcceptFollowRequestArgs = {
  followerId: Scalars['String']['input'];
};


export type MutationAddReactionArgs = {
  postId: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type MutationAddUserToChatroomMutationArgs = {
  chatroomId: Scalars['String']['input'];
  otherUserIds: Array<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type MutationCancelFollowRequestArgs = {
  followingId: Scalars['String']['input'];
};


export type MutationCreateChatroomMutationArgs = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  chatroomName?: InputMaybe<Scalars['String']['input']>;
  isGroupChat?: InputMaybe<Scalars['Boolean']['input']>;
  otherUserId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateCommentArgs = {
  createCommentInput: CreateCommentDto;
};


export type MutationCreateMessageMutationArgs = {
  chatroomId?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  otherUserId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreatePostArgs = {
  createPost: CreatePostDto;
};


export type MutationDeletePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationEditPostArgs = {
  content: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};


export type MutationFollowUserArgs = {
  followingId: Scalars['String']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  loginInput: LoginDto;
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['String']['input'];
};


export type MutationNotInterestedPostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  registerInput: RegisterDto;
};


export type MutationRejectFollowRequestArgs = {
  followerId: Scalars['String']['input'];
};


export type MutationRemoveReactionArgs = {
  postId: Scalars['String']['input'];
};


export type MutationReportPostArgs = {
  postId: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationSavePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationUnsavePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationUserStartedTypingMutationArgs = {
  chatroomId: Scalars['String']['input'];
};


export type MutationUserStoppedTypingMutationArgs = {
  chatroomId: Scalars['String']['input'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type NotificationDto = {
  __typename?: 'NotificationDto';
  actor?: Maybe<UserDto>;
  actorId?: Maybe<Scalars['String']['output']>;
  comment?: Maybe<CommentDto>;
  commentId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  post?: Maybe<PostDto>;
  postId?: Maybe<Scalars['String']['output']>;
  reaction?: Maybe<ReactionDto>;
  reactionId?: Maybe<Scalars['String']['output']>;
  readAt?: Maybe<Scalars['DateTime']['output']>;
  recipient?: Maybe<UserDto>;
  recipientId: Scalars['String']['output'];
  type: NotificationType;
};

export enum NotificationType {
  CommentOnPost = 'COMMENT_ON_POST',
  Login = 'LOGIN',
  NewFollower = 'NEW_FOLLOWER',
  PostDeleted = 'POST_DELETED',
  ReactionOnPost = 'REACTION_ON_POST',
  ReplyOnComment = 'REPLY_ON_COMMENT'
}

export type PageInfoDto = {
  __typename?: 'PageInfoDto';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type PaginatedPostsDto = {
  __typename?: 'PaginatedPostsDto';
  hasMore: Scalars['Boolean']['output'];
  posts: Array<PostFeedDto>;
};

export type Post = {
  __typename?: 'Post';
  comments: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  imageUrl: Scalars['String']['output'];
  likes: Scalars['Float']['output'];
};

export type PostCommentsConnectionDto = {
  __typename?: 'PostCommentsConnectionDto';
  edges: Array<CommentEdgeDto>;
  pageInfo: PageInfoDto;
  totalCount: Scalars['Int']['output'];
};

export type PostDto = {
  __typename?: 'PostDto';
  comments?: Maybe<Array<CommentDto>>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  images?: Maybe<Array<PostImageDto>>;
  isSaved?: Maybe<Scalars['Boolean']['output']>;
  reactions?: Maybe<Array<ReactionDto>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PostFeedDto = {
  __typename?: 'PostFeedDto';
  commentsCount: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  id: Scalars['String']['output'];
  images?: Maybe<Array<PostImageDto>>;
  isSaved?: Maybe<Scalars['Boolean']['output']>;
  reactionsCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userReaction?: Maybe<Scalars['String']['output']>;
};

export type PostImageDto = {
  __typename?: 'PostImageDto';
  id: Scalars['String']['output'];
  postId: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  GetChatUsers: GetChatUsersResponse;
  GetFollowers: GetFollowersDto;
  GetFollowing: GetFollowersDto;
  GetUser: UserProfileDto;
  GetUserChatrooms: GetUserChatroomsResponse;
  GetUsersToFollow: GetUsersToFollowDto;
  SearchUsers: SearchUsersResultDto;
  chatroomDetail: ChatroomDetailDto;
  commentReplies: CommentRepliesConnectionDto;
  getPendingFollowRequests: Array<UserDto>;
  getPost: GetPostType;
  getPosts: PaginatedPostsDto;
  getme: UserDto;
  messagesBetweenUsers: Array<MessageDto>;
  notifications: Array<NotificationDto>;
  postComments: PostCommentsConnectionDto;
  unreadNotificationsCount: Scalars['Int']['output'];
};


export type QueryGetFollowersArgs = {
  getFollowers: GetFollowersInput;
};


export type QueryGetFollowingArgs = {
  getFollowing: GetFollowersInput;
};


export type QueryGetUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetUsersToFollowArgs = {
  getUsersToFollow: GetUsersToFollow;
};


export type QuerySearchUsersArgs = {
  searchUsersInput: SearchUsersInput;
};


export type QueryChatroomDetailArgs = {
  chatroomId?: InputMaybe<Scalars['String']['input']>;
  otherUserId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCommentRepliesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  commentId: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  includeChildren?: InputMaybe<Scalars['Boolean']['input']>;
  secondLevelLimit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPostArgs = {
  postId: Scalars['String']['input'];
};


export type QueryGetPostsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  feedType?: InputMaybe<Scalars['String']['input']>;
  take: Scalars['Float']['input'];
};


export type QueryMessagesBetweenUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  otherUserId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNotificationsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPostCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directRepliesLimit?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  postId: Scalars['String']['input'];
  secondLevelLimit?: InputMaybe<Scalars['Int']['input']>;
};

export type ReactionDto = {
  __typename?: 'ReactionDto';
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserDto>;
  createdById: Scalars['String']['output'];
  id: Scalars['String']['output'];
  post?: Maybe<PostDto>;
  postId: Scalars['String']['output'];
  type: ReactionType;
  updatedAt: Scalars['DateTime']['output'];
};

/** Types of reactions a user can make on a post */
export enum ReactionType {
  Haha = 'HAHA',
  Like = 'LIKE',
  Love = 'LOVE',
  Sad = 'SAD',
  Wow = 'WOW'
}

export type RegisterDto = {
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SearchUsersInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  searchTerm: Scalars['String']['input'];
};

export type SearchUsersResultDto = {
  __typename?: 'SearchUsersResultDto';
  hasMore: Scalars['Boolean']['output'];
  users: Array<UserDto>;
};

export type Subscription = {
  __typename?: 'Subscription';
  chatroomCreated?: Maybe<MessageDto>;
  newMessage?: Maybe<MessageDto>;
  userAddedToChatroom?: Maybe<ChatroomDto>;
  userDisconnect?: Maybe<UserPresenceDto>;
  userOnline?: Maybe<UserPresenceDto>;
  userStartedTyping?: Maybe<UserDto>;
  userStoppedTyping?: Maybe<UserDto>;
};


export type SubscriptionChatroomCreatedArgs = {
  otherUserId: Scalars['String']['input'];
};


export type SubscriptionNewMessageArgs = {
  chatroomId: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionUserAddedToChatroomArgs = {
  otherUserId: Scalars['String']['input'];
};


export type SubscriptionUserDisconnectArgs = {
  userId: Scalars['String']['input'];
};


export type SubscriptionUserOnlineArgs = {
  userId: Scalars['String']['input'];
};


export type SubscriptionUserStartedTypingArgs = {
  chatroomId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type SubscriptionUserStoppedTypingArgs = {
  chatroomId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type UpdateUserDto = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  isPrivate?: InputMaybe<Scalars['Boolean']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  twoFactorEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserDto = {
  __typename?: 'UserDto';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  chatroomsCreated?: Maybe<Array<ChatroomDto>>;
  comments?: Maybe<Array<CommentDto>>;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  firstname: Scalars['String']['output'];
  followStatus?: Maybe<Scalars['String']['output']>;
  followers?: Maybe<Array<FollowerDto>>;
  following?: Maybe<Array<FollowerDto>>;
  id: Scalars['String']['output'];
  isFollowing?: Maybe<Scalars['Boolean']['output']>;
  isPrivate: Scalars['Boolean']['output'];
  lastSeenAt?: Maybe<Scalars['DateTime']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
  memberships?: Maybe<Array<ChatroomUserDto>>;
  messages?: Maybe<Array<MessageDto>>;
  posts?: Maybe<Array<PostDto>>;
  reactions?: Maybe<Array<ReactionDto>>;
  updatedAt: Scalars['DateTime']['output'];
  verified: Scalars['Boolean']['output'];
};

export type UserPresenceDto = {
  __typename?: 'UserPresenceDto';
  isOnline: Scalars['Boolean']['output'];
  lastSeenAt?: Maybe<Scalars['DateTime']['output']>;
  userId: Scalars['String']['output'];
};

export type UserProfileDto = {
  __typename?: 'UserProfileDto';
  followStatus?: Maybe<Scalars['String']['output']>;
  followers?: Maybe<Scalars['Float']['output']>;
  following?: Maybe<Scalars['Float']['output']>;
  posts?: Maybe<Array<Post>>;
  user: UserDto;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  accessToken?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserDto>;
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', accessToken?: string | null, refreshToken?: string | null, user?: { __typename?: 'UserDto', id: string, email?: string | null, firstname: string, avatarUrl?: string | null } | null } };

export type RegisterMutationVariables = Exact<{
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', accessToken?: string | null, refreshToken?: string | null, user?: { __typename?: 'UserDto', id: string, firstname: string, email?: string | null } | null } };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'UserResponse', user?: { __typename?: 'UserDto', id: string, firstname: string, email?: string | null, bio?: string | null, avatarUrl?: string | null } | null } };

export type SendResetCodeMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type SendResetCodeMutation = { __typename?: 'Mutation', forgotPassword: string };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'UserResponse', user?: { __typename?: 'UserDto', id: string, firstname: string, email?: string | null, bio?: string | null, avatarUrl?: string | null } | null } };

export type AddUsersToChatroomMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  chatroomId: Scalars['String']['input'];
  otherUserIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type AddUsersToChatroomMutation = { __typename?: 'Mutation', addUserToChatroomMutation: Array<string> };

export type CreateCommentMutationVariables = Exact<{
  postId: Scalars['String']['input'];
  content: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'CommentDto', id: string, content: string, postId: string, createdAt: any, parentId?: string | null, replyCount?: number | null, updatedAt: any, createdBy?: { __typename?: 'UserDto', id: string, avatarUrl?: string | null, firstname: string, lastname?: string | null } | null } };

export type CreateChatroomMutationVariables = Exact<{
  chatroomName?: InputMaybe<Scalars['String']['input']>;
  isGroupChat?: InputMaybe<Scalars['Boolean']['input']>;
  otherUserId?: InputMaybe<Scalars['String']['input']>;
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateChatroomMutation = { __typename?: 'Mutation', createChatroomMutation: string };

export type CreateMessageMutationVariables = Exact<{
  chatroomId?: InputMaybe<Scalars['String']['input']>;
  otherUserId?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessageMutation: { __typename?: 'MessageDto', id: string, content?: string | null, imageUrl?: string | null, createdAt: any, updatedAt: any, isEdited: boolean, user?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null, chatroom?: { __typename?: 'ChatroomDto', id: string, name?: string | null, isGroup: boolean, avatarUrl?: string | null, memberships?: Array<{ __typename?: 'ChatroomUserDto', userId: string, user?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null }> | null } | null } };

export type UserStartedTypingMutationMutationVariables = Exact<{
  chatroomId: Scalars['String']['input'];
}>;


export type UserStartedTypingMutationMutation = { __typename?: 'Mutation', userStartedTypingMutation: { __typename?: 'UserDto', id: string, firstname: string, email?: string | null } };

export type UserStoppedTypingMutationMutationVariables = Exact<{
  chatroomId: Scalars['String']['input'];
}>;


export type UserStoppedTypingMutationMutation = { __typename?: 'Mutation', userStoppedTypingMutation: { __typename?: 'UserDto', id: string, firstname: string, email?: string | null } };

export type MarkAllNotificationsAsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllNotificationsAsReadMutation = { __typename?: 'Mutation', markAllNotificationsAsRead: boolean };

export type MarkNotificationAsReadMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type MarkNotificationAsReadMutation = { __typename?: 'Mutation', markNotificationAsRead: boolean };

export type AddReactionMutationVariables = Exact<{
  postId: Scalars['String']['input'];
  type: Scalars['String']['input'];
}>;


export type AddReactionMutation = { __typename?: 'Mutation', addReaction: boolean };

export type CreatePostMutationVariables = Exact<{
  content: Scalars['String']['input'];
  imageUrls: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: string };

export type DeletePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: string };

export type EditPostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
  content: Scalars['String']['input'];
}>;


export type EditPostMutation = { __typename?: 'Mutation', editPost: { __typename?: 'PostDto', id: string, content: string, updatedAt: any } };

export type NotInterestedPostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type NotInterestedPostMutation = { __typename?: 'Mutation', notInterestedPost: boolean };

export type RemoveReactionMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type RemoveReactionMutation = { __typename?: 'Mutation', removeReaction: boolean };

export type ReportPostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
  reason: Scalars['String']['input'];
}>;


export type ReportPostMutation = { __typename?: 'Mutation', reportPost: boolean };

export type SavePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type SavePostMutation = { __typename?: 'Mutation', savePost: boolean };

export type UnsavePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type UnsavePostMutation = { __typename?: 'Mutation', unsavePost: boolean };

export type AcceptFollowRequestMutationVariables = Exact<{
  followerId: Scalars['String']['input'];
}>;


export type AcceptFollowRequestMutation = { __typename?: 'Mutation', acceptFollowRequest: string };

export type CancelFollowRequestMutationVariables = Exact<{
  followingId: Scalars['String']['input'];
}>;


export type CancelFollowRequestMutation = { __typename?: 'Mutation', cancelFollowRequest: string };

export type FollowUserMutationVariables = Exact<{
  followingId: Scalars['String']['input'];
}>;


export type FollowUserMutation = { __typename?: 'Mutation', followUser: string };

export type RejectFollowRequestMutationVariables = Exact<{
  followerId: Scalars['String']['input'];
}>;


export type RejectFollowRequestMutation = { __typename?: 'Mutation', rejectFollowRequest: string };

export type UnfollowUserMutationVariables = Exact<{
  followingId: Scalars['String']['input'];
}>;


export type UnfollowUserMutation = { __typename?: 'Mutation', UnfollowUser: string };

export type UpdateProfileMutationVariables = Exact<{
  firstname?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  isPrivate?: InputMaybe<Scalars['Boolean']['input']>;
  twoFactorEnabled?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', UpdateUser: { __typename?: 'UserDto', id: string, email?: string | null, firstname: string, lastname?: string | null, bio?: string | null, avatarUrl?: string | null, isPrivate: boolean } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', getme: { __typename?: 'UserDto', id: string, email?: string | null, firstname: string, lastname?: string | null, avatarUrl?: string | null, lastSeenAt?: any | null, createdAt: any, updatedAt: any, verified: boolean, isPrivate: boolean, bio?: string | null } };

export type GetPostCommentsQueryVariables = Exact<{
  postId: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  directRepliesLimit?: InputMaybe<Scalars['Int']['input']>;
  secondLevelLimit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPostCommentsQuery = { __typename?: 'Query', postComments: { __typename?: 'PostCommentsConnectionDto', totalCount: number, edges: Array<{ __typename?: 'CommentEdgeDto', cursor: string, node: { __typename?: 'CommentDto', id: string, content: string, createdAt: any, replyCount?: number | null, repliesHasNextPage?: boolean | null, createdBy?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null, replies?: Array<{ __typename?: 'CommentDto', id: string, content: string, replyCount?: number | null, repliesHasNextPage?: boolean | null, createdBy?: { __typename?: 'UserDto', id: string, firstname: string, avatarUrl?: string | null } | null, replies?: Array<{ __typename?: 'CommentDto', id: string, content: string, createdBy?: { __typename?: 'UserDto', id: string, firstname: string, avatarUrl?: string | null } | null }> | null }> | null } }>, pageInfo: { __typename?: 'PageInfoDto', endCursor?: string | null, hasNextPage: boolean } } };

export type ChatroomDetailQueryVariables = Exact<{
  chatroomId?: InputMaybe<Scalars['String']['input']>;
  otherUserId?: InputMaybe<Scalars['String']['input']>;
}>;


export type ChatroomDetailQuery = { __typename?: 'Query', chatroomDetail: { __typename?: 'ChatroomDetailDto', id: string, isGroup: boolean, name?: string | null, avatarUrl?: string | null, totalMessages: number, totalPhotos: number, totalMembers?: number | null, members?: Array<{ __typename?: 'ChatroomMemberDetailDto', id: string, userId: string, firstname?: string | null, lastname?: string | null, avatarUrl?: string | null, isOwner: boolean }> | null, directUser?: { __typename?: 'ChatroomDirectUserDto', id: string, firstname?: string | null, lastname?: string | null, avatarUrl?: string | null, bio?: string | null, email: string, totalFollowers: number, totalFollowing: number } | null } };

export type MessagesBetweenUsersQueryVariables = Exact<{
  otherUserId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MessagesBetweenUsersQuery = { __typename?: 'Query', messagesBetweenUsers: Array<{ __typename?: 'MessageDto', id: string, content?: string | null, imageUrl?: string | null, createdAt: any, updatedAt: any, isEdited: boolean, user?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null, lastSeenAt?: any | null } | null, chatroom?: { __typename?: 'ChatroomDto', id: string, name?: string | null, isGroup: boolean, avatarUrl?: string | null, memberships?: Array<{ __typename?: 'ChatroomUserDto', userId: string, user?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null, lastSeenAt?: any | null } | null }> | null } | null }> };

export type GetNotificationsQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetNotificationsQuery = { __typename?: 'Query', notifications: Array<{ __typename?: 'NotificationDto', id: string, type: NotificationType, isRead: boolean, createdAt: any, actor?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null, recipient?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null, post?: { __typename?: 'PostDto', id: string, content: string, images?: Array<{ __typename?: 'PostImageDto', id: string, url: string }> | null } | null, comment?: { __typename?: 'CommentDto', id: string, content: string } | null, reaction?: { __typename?: 'ReactionDto', id: string, type: ReactionType } | null }> };

export type GetUnreadNotificationsCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUnreadNotificationsCountQuery = { __typename?: 'Query', unreadNotificationsCount: number };

export type GetPostQueryVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type GetPostQuery = { __typename?: 'Query', getPost: { __typename?: 'GetPostType', id: string, content: string, createdAt: any, updatedAt: any, createdById: string, commentsCount: number, reactionsCount: number, userReaction?: string | null, isSaved?: boolean | null, createdBy?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null, images?: Array<{ __typename?: 'PostImageDto', id: string, url: string, postId: string }> | null, comments?: Array<{ __typename?: 'CommentDto', id: string, content: string, createdAt: any, parentId?: string | null, updatedAt: any, createdBy?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null }> | null, reactions?: Array<{ __typename?: 'ReactionDto', id: string, type: ReactionType, createdById: string }> | null } };

export type GetPostsQueryVariables = Exact<{
  take: Scalars['Float']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  feedType?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPostsQuery = { __typename?: 'Query', getPosts: { __typename?: 'PaginatedPostsDto', hasMore: boolean, posts: Array<{ __typename?: 'PostFeedDto', id: string, content: string, createdAt: any, updatedAt: any, createdById: string, isSaved?: boolean | null, commentsCount: number, reactionsCount: number, userReaction?: string | null, createdBy?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null, lastSeenAt?: any | null } | null, images?: Array<{ __typename?: 'PostImageDto', id: string, url: string, postId: string }> | null }> } };

export type GetFollowersQueryVariables = Exact<{
  take: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
}>;


export type GetFollowersQuery = { __typename?: 'Query', GetFollowers: { __typename?: 'GetFollowersDto', totalFollowers?: number | null, totalFollowing?: number | null, hasMore?: boolean | null, users?: Array<{ __typename?: 'UserDto', id: string, firstname: string, avatarUrl?: string | null, bio?: string | null }> | null } };

export type GetFollowingQueryVariables = Exact<{
  take: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
}>;


export type GetFollowingQuery = { __typename?: 'Query', GetFollowing: { __typename?: 'GetFollowersDto', totalFollowers?: number | null, totalFollowing?: number | null, hasMore?: boolean | null, users?: Array<{ __typename?: 'UserDto', id: string, firstname: string, avatarUrl?: string | null, bio?: string | null }> | null } };

export type GetUserChatroomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserChatroomsQuery = { __typename?: 'Query', GetUserChatrooms: { __typename?: 'GetUserChatroomsResponse', chatrooms: Array<{ __typename?: 'ChatroomDto', id: string, name?: string | null, isGroup: boolean, avatarUrl?: string | null, createdById: string, createdAt: any, updatedAt: any, memberships?: Array<{ __typename?: 'ChatroomUserDto', userId: string, lastReadAt?: any | null, user?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null, lastSeenAt?: any | null } | null }> | null, messages?: Array<{ __typename?: 'MessageDto', id: string, content?: string | null, imageUrl?: string | null, createdAt: any, updatedAt: any, isEdited: boolean, user?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null }> | null }> } };

export type GetUserProfileQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetUserProfileQuery = { __typename?: 'Query', GetUser: { __typename?: 'UserProfileDto', followStatus?: string | null, followers?: number | null, following?: number | null, user: { __typename?: 'UserDto', id: string, avatarUrl?: string | null, firstname: string, lastname?: string | null, bio?: string | null, email?: string | null, isPrivate: boolean, isFollowing?: boolean | null, followStatus?: string | null }, posts?: Array<{ __typename?: 'Post', id: string, imageUrl: string, likes: number, comments: number }> | null } };

export type GetUsersToFollowQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type GetUsersToFollowQuery = { __typename?: 'Query', GetUsersToFollow: { __typename?: 'GetUsersToFollowDto', hasMore: boolean, users: Array<{ __typename?: 'UserDto', id: string, firstname: string, avatarUrl?: string | null, email?: string | null, bio?: string | null, isPrivate: boolean, isFollowing?: boolean | null }> } };

export type SearchUsersQueryVariables = Exact<{
  searchUsersInput: SearchUsersInput;
}>;


export type SearchUsersQuery = { __typename?: 'Query', SearchUsers: { __typename?: 'SearchUsersResultDto', hasMore: boolean, users: Array<{ __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, bio?: string | null, avatarUrl?: string | null }> } };

export type ChatroomCreatedSubscriptionVariables = Exact<{
  otherUserId: Scalars['String']['input'];
}>;


export type ChatroomCreatedSubscription = { __typename?: 'Subscription', chatroomCreated?: { __typename?: 'MessageDto', id: string, content?: string | null, imageUrl?: string | null, createdAt: any, updatedAt: any, isEdited: boolean, user?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null, chatroom?: { __typename?: 'ChatroomDto', id: string, name?: string | null, isGroup: boolean, avatarUrl?: string | null, updatedAt: any, memberships?: Array<{ __typename?: 'ChatroomUserDto', userId: string, user?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null }> | null } | null } | null };

export type NewMessageSubscriptionVariables = Exact<{
  chatroomId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type NewMessageSubscription = { __typename?: 'Subscription', newMessage?: { __typename?: 'MessageDto', id: string, content?: string | null, imageUrl?: string | null, createdAt: any, updatedAt: any, isEdited: boolean, user?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null, chatroom?: { __typename?: 'ChatroomDto', id: string, name?: string | null, isGroup: boolean, avatarUrl?: string | null, memberships?: Array<{ __typename?: 'ChatroomUserDto', userId: string, user?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null }> | null } | null } | null };

export type UserAddedToChatroomSubscriptionVariables = Exact<{
  otherUserId: Scalars['String']['input'];
}>;


export type UserAddedToChatroomSubscription = { __typename?: 'Subscription', userAddedToChatroom?: { __typename?: 'ChatroomDto', id: string, name?: string | null, isGroup: boolean, avatarUrl?: string | null, createdAt: any, updatedAt: any, memberships?: Array<{ __typename?: 'ChatroomUserDto', userId: string, user?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null }> | null, messages?: Array<{ __typename?: 'MessageDto', id: string, content?: string | null, imageUrl?: string | null, createdAt: any, updatedAt: any, isEdited: boolean, user?: { __typename?: 'UserDto', id: string, firstname: string, lastname?: string | null, avatarUrl?: string | null } | null }> | null } | null };

export type UserDisconnectSubscriptionVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type UserDisconnectSubscription = { __typename?: 'Subscription', userDisconnect?: { __typename?: 'UserPresenceDto', userId: string, isOnline: boolean, lastSeenAt?: any | null } | null };

export type UserOnlineSubscriptionVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type UserOnlineSubscription = { __typename?: 'Subscription', userOnline?: { __typename?: 'UserPresenceDto', userId: string, isOnline: boolean, lastSeenAt?: any | null } | null };

export type UserStartedTypingSubscriptionVariables = Exact<{
  chatroomId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type UserStartedTypingSubscription = { __typename?: 'Subscription', userStartedTyping?: { __typename?: 'UserDto', id: string, firstname: string, email?: string | null, avatarUrl?: string | null } | null };

export type UserStoppedTypingSubscriptionVariables = Exact<{
  chatroomId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type UserStoppedTypingSubscription = { __typename?: 'Subscription', userStoppedTyping?: { __typename?: 'UserDto', id: string, firstname: string, email?: string | null, avatarUrl?: string | null } | null };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"loginInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"registerInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"firstname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"lastname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const SendResetCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendResetCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<SendResetCodeMutation, SendResetCodeMutationVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const AddUsersToChatroomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddUsersToChatroom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otherUserIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addUserToChatroomMutation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"chatroomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"otherUserIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otherUserIds"}}}]}]}}]} as unknown as DocumentNode<AddUsersToChatroomMutation, AddUsersToChatroomMutationVariables>;
export const CreateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createCommentInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"parentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const CreateChatroomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChatroom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatroomName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isGroupChat"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otherUserId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChatroomMutation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatroomName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatroomName"}}},{"kind":"Argument","name":{"kind":"Name","value":"isGroupChat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isGroupChat"}}},{"kind":"Argument","name":{"kind":"Name","value":"otherUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otherUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"avatarUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}}}]}]}}]} as unknown as DocumentNode<CreateChatroomMutation, CreateChatroomMutationVariables>;
export const CreateMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otherUserId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMessageMutation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatroomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"otherUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otherUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"imageUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isEdited"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chatroom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isGroup"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateMessageMutation, CreateMessageMutationVariables>;
export const UserStartedTypingMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserStartedTypingMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userStartedTypingMutation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatroomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UserStartedTypingMutationMutation, UserStartedTypingMutationMutationVariables>;
export const UserStoppedTypingMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserStoppedTypingMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userStoppedTypingMutation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatroomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UserStoppedTypingMutationMutation, UserStoppedTypingMutationMutationVariables>;
export const MarkAllNotificationsAsReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkAllNotificationsAsRead"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markAllNotificationsAsRead"}}]}}]} as unknown as DocumentNode<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>;
export const MarkNotificationAsReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkNotificationAsRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markNotificationAsRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;
export const AddReactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddReaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addReaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}]}}]} as unknown as DocumentNode<AddReactionMutation, AddReactionMutationVariables>;
export const CreatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageUrls"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createPost"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"imageUrls"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageUrls"}}}]}}]}]}}]} as unknown as DocumentNode<CreatePostMutation, CreatePostMutationVariables>;
export const DeletePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}]}]}}]} as unknown as DocumentNode<DeletePostMutation, DeletePostMutationVariables>;
export const EditPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<EditPostMutation, EditPostMutationVariables>;
export const NotInterestedPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NotInterestedPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notInterestedPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}]}]}}]} as unknown as DocumentNode<NotInterestedPostMutation, NotInterestedPostMutationVariables>;
export const RemoveReactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveReaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeReaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}]}]}}]} as unknown as DocumentNode<RemoveReactionMutation, RemoveReactionMutationVariables>;
export const ReportPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReportPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reportPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}]}]}}]} as unknown as DocumentNode<ReportPostMutation, ReportPostMutationVariables>;
export const SavePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SavePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"savePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}]}]}}]} as unknown as DocumentNode<SavePostMutation, SavePostMutationVariables>;
export const UnsavePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnsavePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsavePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}]}]}}]} as unknown as DocumentNode<UnsavePostMutation, UnsavePostMutationVariables>;
export const AcceptFollowRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptFollowRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"followerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptFollowRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"followerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"followerId"}}}]}]}}]} as unknown as DocumentNode<AcceptFollowRequestMutation, AcceptFollowRequestMutationVariables>;
export const CancelFollowRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelFollowRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"followingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelFollowRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"followingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"followingId"}}}]}]}}]} as unknown as DocumentNode<CancelFollowRequestMutation, CancelFollowRequestMutationVariables>;
export const FollowUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FollowUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"followingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"followingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"followingId"}}}]}]}}]} as unknown as DocumentNode<FollowUserMutation, FollowUserMutationVariables>;
export const RejectFollowRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RejectFollowRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"followerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rejectFollowRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"followerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"followerId"}}}]}]}}]} as unknown as DocumentNode<RejectFollowRequestMutation, RejectFollowRequestMutationVariables>;
export const UnfollowUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnfollowUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"followingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UnfollowUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"followingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"followingId"}}}]}]}}]} as unknown as DocumentNode<UnfollowUserMutation, UnfollowUserMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bio"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isPrivate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"twoFactorEnabled"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UpdateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updateUser"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"firstname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"lastname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"bio"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bio"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"avatarUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isPrivate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isPrivate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"twoFactorEnabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"twoFactorEnabled"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getme"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetPostCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPostComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"5"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"directRepliesLimit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"3"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secondLevelLimit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"2"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"directRepliesLimit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"directRepliesLimit"}}},{"kind":"Argument","name":{"kind":"Name","value":"secondLevelLimit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secondLevelLimit"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"repliesHasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"repliesHasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetPostCommentsQuery, GetPostCommentsQueryVariables>;
export const ChatroomDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChatroomDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otherUserId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chatroomDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatroomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"otherUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otherUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isGroup"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"totalMessages"}},{"kind":"Field","name":{"kind":"Name","value":"totalPhotos"}},{"kind":"Field","name":{"kind":"Name","value":"totalMembers"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isOwner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"directUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"totalFollowers"}},{"kind":"Field","name":{"kind":"Name","value":"totalFollowing"}}]}}]}}]}}]} as unknown as DocumentNode<ChatroomDetailQuery, ChatroomDetailQueryVariables>;
export const MessagesBetweenUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MessagesBetweenUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otherUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messagesBetweenUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"otherUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otherUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isEdited"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chatroom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isGroup"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenAt"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MessagesBetweenUsersQuery, MessagesBetweenUsersQueryVariables>;
export const GetNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<GetNotificationsQuery, GetNotificationsQueryVariables>;
export const GetUnreadNotificationsCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUnreadNotificationsCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unreadNotificationsCount"}}]}}]} as unknown as DocumentNode<GetUnreadNotificationsCountQuery, GetUnreadNotificationsCountQueryVariables>;
export const GetPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdById"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdById"}}]}},{"kind":"Field","name":{"kind":"Name","value":"commentsCount"}},{"kind":"Field","name":{"kind":"Name","value":"reactionsCount"}},{"kind":"Field","name":{"kind":"Name","value":"userReaction"}},{"kind":"Field","name":{"kind":"Name","value":"isSaved"}}]}}]}}]} as unknown as DocumentNode<GetPostQuery, GetPostQueryVariables>;
export const GetPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"feedType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPosts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"feedType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"feedType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdById"}},{"kind":"Field","name":{"kind":"Name","value":"isSaved"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"commentsCount"}},{"kind":"Field","name":{"kind":"Name","value":"reactionsCount"}},{"kind":"Field","name":{"kind":"Name","value":"userReaction"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}}]}}]}}]} as unknown as DocumentNode<GetPostsQuery, GetPostsQueryVariables>;
export const GetFollowersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFollowers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GetFollowers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"getFollowers"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalFollowers"}},{"kind":"Field","name":{"kind":"Name","value":"totalFollowing"}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}}]}}]}}]} as unknown as DocumentNode<GetFollowersQuery, GetFollowersQueryVariables>;
export const GetFollowingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFollowing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GetFollowing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"getFollowing"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalFollowers"}},{"kind":"Field","name":{"kind":"Name","value":"totalFollowing"}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}}]}}]}}]} as unknown as DocumentNode<GetFollowingQuery, GetFollowingQueryVariables>;
export const GetUserChatroomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserChatrooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GetUserChatrooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chatrooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isGroup"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdById"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lastReadAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isEdited"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUserChatroomsQuery, GetUserChatroomsQueryVariables>;
export const GetUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GetUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"isFollowing"}},{"kind":"Field","name":{"kind":"Name","value":"followStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"followStatus"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const GetUsersToFollowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersToFollow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"GetUsersToFollow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"getUsersToFollow"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"isFollowing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}}]}}]}}]} as unknown as DocumentNode<GetUsersToFollowQuery, GetUsersToFollowQueryVariables>;
export const SearchUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchUsersInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchUsersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"SearchUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchUsersInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchUsersInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<SearchUsersQuery, SearchUsersQueryVariables>;
export const ChatroomCreatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ChatroomCreated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otherUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chatroomCreated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"otherUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otherUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isEdited"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chatroom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isGroup"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ChatroomCreatedSubscription, ChatroomCreatedSubscriptionVariables>;
export const NewMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatroomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isEdited"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chatroom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isGroup"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<NewMessageSubscription, NewMessageSubscriptionVariables>;
export const UserAddedToChatroomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"UserAddedToChatroom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otherUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userAddedToChatroom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"otherUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otherUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isGroup"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isEdited"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserAddedToChatroomSubscription, UserAddedToChatroomSubscriptionVariables>;
export const UserDisconnectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"UserDisconnect"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userDisconnect"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenAt"}}]}}]}}]} as unknown as DocumentNode<UserDisconnectSubscription, UserDisconnectSubscriptionVariables>;
export const UserOnlineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"UserOnline"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userOnline"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenAt"}}]}}]}}]} as unknown as DocumentNode<UserOnlineSubscription, UserOnlineSubscriptionVariables>;
export const UserStartedTypingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"UserStartedTyping"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userStartedTyping"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatroomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<UserStartedTypingSubscription, UserStartedTypingSubscriptionVariables>;
export const UserStoppedTypingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"UserStoppedTyping"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userStoppedTyping"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatroomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatroomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<UserStoppedTypingSubscription, UserStoppedTypingSubscriptionVariables>;