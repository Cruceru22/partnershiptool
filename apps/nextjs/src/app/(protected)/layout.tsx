"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@acme/auth/client";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/api/auth/signin");
    }
  }, [session, isPending, router]);

  // Don't render anything until we have checked authentication
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!session?.user) {
    return null;
  }

  return <>{children}</>;
}
