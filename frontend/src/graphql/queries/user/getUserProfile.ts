import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: String!) {
    GetUser(userId: $userId) {
      user {
        id
        avatarUrl
        firstname
        lastname
        bio
        email
        isPrivate
        isFollowing
        followStatus
      }
      followStatus
      followers
      following
      posts {
        id
        imageUrl
        likes
        comments
      }
    }
  }
`;
