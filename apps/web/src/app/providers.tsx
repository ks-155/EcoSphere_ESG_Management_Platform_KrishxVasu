"use client";

/**
 * Providers — global context wrappers.
 *
 * Performance optimizations applied:
 * 1. QueryClient created once (useState prevents recreation on re-renders)
 * 2. staleTime: 5min — prevents redundant refetches on tab focus/navigation
 * 3. gcTime (formerly cacheTime): 10min — keeps cached data in memory longer
 * 4. refetchOnWindowFocus: false — eliminates surprise network requests
 * 5. retry: 1 — don't hammer a failing API; fail fast
 * 6. structuralSharing: true (default) — prevents unnecessary re-renders
 *    by reusing unchanged object references between fetches
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes — no refetch on navigation
        staleTime: 5 * 60 * 1000,
        // Keep unused cache for 10 minutes (improves back-navigation speed)
        gcTime: 10 * 60 * 1000,
        // Don't refetch when switching tabs — reduces network noise
        refetchOnWindowFocus: false,
        // Don't retry immediately; avoids blocking UI on slow API
        retry: 1,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      },
      mutations: {
        // Surface errors to error boundaries
        throwOnError: false,
      },
    },
  });
}

// Singleton for client-side (SSR gets a fresh instance per request)
let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always create new
    return makeQueryClient();
  }
  // Browser: reuse singleton
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  // useState ensures we don't recreate on every render
  const [queryClient] = useState(getQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
