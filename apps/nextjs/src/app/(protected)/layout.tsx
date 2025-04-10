"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Use tRPC to get the session
  const trpc = useTRPC();
  const { data: sessionData, isLoading } = useQuery(
    trpc.auth.getSession.queryOptions(),
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !sessionData?.user) {
      router.push("/api/auth/signin");
    }
  }, [sessionData, isLoading, router]);

  // Don't render anything until we have checked authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!sessionData?.user) {
    return null;
  }

  // User is authenticated, render the protected content
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="text-xl font-bold">
            Comment.video
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="text-sm font-medium hover:text-primary"
            >
              Dashboard
            </a>
            <a
              href="/members"
              className="text-sm font-medium hover:text-primary"
            >
              Members
            </a>
            <a
              href="/settings"
              className="text-sm font-medium hover:text-primary"
            >
              Settings
            </a>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
