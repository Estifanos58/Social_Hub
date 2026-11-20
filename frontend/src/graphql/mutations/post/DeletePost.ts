import { gql } from "@apollo/client";

export const DELETE_POST = gql`
    mutation DeletePost($postId: String!) {
        deletePost(postId: $postId)}`

export const DELETE_POST_MUTATION = DELETE_POST;
