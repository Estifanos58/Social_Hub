import { gql } from "@apollo/client";

export const CANCEL_FOLLOW_REQUEST = gql`
  mutation CancelFollowRequest($followingId: String!) {
    cancelFollowRequest(followingId: $followingId)
  }
`;
