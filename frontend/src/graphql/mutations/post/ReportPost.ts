import { gql } from "@apollo/client";

export const REPORT_POST_MUTATION = gql`
  mutation ReportPost($postId: String!, $reason: String!) {
    reportPost(postId: $postId, reason: $reason)
  }
`;
