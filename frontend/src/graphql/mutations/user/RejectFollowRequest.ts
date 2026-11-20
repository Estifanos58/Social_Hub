import { gql } from "@apollo/client";

export const REJECT_FOLLOW_REQUEST = gql`
  mutation RejectFollowRequest($followerId: String!) {
    rejectFollowRequest(followerId: $followerId)
  }
`;
