import { gql } from "@apollo/client";

export const ACCEPT_FOLLOW_REQUEST = gql`
  mutation AcceptFollowRequest($followerId: String!) {
    acceptFollowRequest(followerId: $followerId)
  }
`;
