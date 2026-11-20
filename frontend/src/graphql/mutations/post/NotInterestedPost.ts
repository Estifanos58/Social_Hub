import { gql } from "@apollo/client";

export const NOT_INTERESTED_POST_MUTATION = gql`
  mutation NotInterestedPost($postId: String!) {
    notInterestedPost(postId: $postId)
  }
`;
