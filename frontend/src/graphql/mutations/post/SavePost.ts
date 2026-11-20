import { gql } from "@apollo/client";

export const SAVE_POST_MUTATION = gql`
  mutation SavePost($postId: String!) {
    savePost(postId: $postId)
  }
`;

export const UNSAVE_POST_MUTATION = gql`
  mutation UnsavePost($postId: String!) {
    unsavePost(postId: $postId)
  }
`;
