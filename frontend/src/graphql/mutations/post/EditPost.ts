import { gql } from "@apollo/client";

export const EDIT_POST_MUTATION = gql`
  mutation EditPost($postId: String!, $content: String!) {
    editPost(postId: $postId, content: $content) {
      id
      content
      updatedAt
    }
  }
`;
