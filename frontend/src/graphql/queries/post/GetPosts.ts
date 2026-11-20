import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts($take: Float!, $cursor: String, $feedType: String) {
    getPosts(take: $take, cursor: $cursor, feedType: $feedType) {
      posts {
        id
        content
        createdAt
        updatedAt
        createdById
        isSaved
        createdBy {
          id
          firstname
          lastname
          avatarUrl
          lastSeenAt
        }
        commentsCount
        reactionsCount
        userReaction
        images {
          id
          url
          postId
        }
      }
      hasMore
    }
  }
`;
