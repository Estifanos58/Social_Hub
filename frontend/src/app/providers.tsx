"use client";

import { ReactNode, Suspense } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "../../apolloClient";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "@/components/custom/auth/ProtectedRoute";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ApolloProvider client={client}>
      <Toaster />
      <Suspense fallback={null}>
        <ProtectedRoute>{children}</ProtectedRoute>
      </Suspense>
    </ApolloProvider>
  );
}
