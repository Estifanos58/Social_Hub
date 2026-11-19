import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  Observable,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from "@apollo/client/link/context";

import { useUserStore } from "./src/store/userStore";

loadErrorMessages();
loadDevMessages();

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/graphql";
const wsUrl =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000/graphql";

// HTTP Link for queries & mutations
const httpLink = new HttpLink({
  uri: apiUrl,
  credentials: "include", // send httpOnly cookies across requests
});

// Attach auth headers to every HTTP request if available in memory
const authLink = setContext((_, { headers }) => {
  const { accessToken } = useUserStore.getState();
  const nextHeaders: Record<string, string> = {};

  if (headers) {
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        nextHeaders[key] = value;
      });
    } else {
      Object.assign(nextHeaders, headers as Record<string, string>);
    }
  }

  if (accessToken) {
    nextHeaders.Authorization = `Bearer ${accessToken}`;
  }

  return {
    headers: nextHeaders,
  };
});

// Capture refreshed access token from response headers
const afterwareLink = new ApolloLink((operation, forward) =>
  new Observable((observer) => {
    const subscription = forward(operation).subscribe({
      next: (result) => {
        if (typeof window !== "undefined") {
          const contextResponse = operation.getContext().response as
            | Response
            | undefined;
          const accessFromHeader = contextResponse?.headers?.get("x-access-token");

          if (accessFromHeader) {
            useUserStore.getState().setAccessToken(accessFromHeader);
          }
        }

        observer.next(result);
      },
      error: (error) => observer.error?.(error),
      complete: () => observer.complete?.(),
    });

    return () => {
      subscription.unsubscribe();
    };
  })
);

// WebSocket Link for subscriptions with unified auth
const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: wsUrl,
          retryAttempts: 5,
          connectionParams: () => {
            const { accessToken } = useUserStore.getState();
            const params: Record<string, string> = {};

            if (accessToken) {
              params.Authorization = `Bearer ${accessToken}`;
            }

            return params;
          },
        })
      )
    : null;

const httpPipeline = ApolloLink.from([authLink, afterwareLink, httpLink]);

// Split based on operation type
const splitLink = wsLink
  ? ApolloLink.split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpPipeline
    )
  : httpPipeline;

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});
