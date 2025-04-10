"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LogOut, MessageSquare, User, Users } from "lucide-react";

import { authClient } from "@acme/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { useTRPC } from "~/trpc/react";

// Define a type for the user
interface UserData {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export const LandingNavbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use tRPC to get the session
  const trpc = useTRPC();
  const { data: sessionData, isLoading: isSessionLoading } = useQuery(
    trpc.auth.getSession.queryOptions(),
  );

  // Get active organization
  const { data: activeOrganization } = authClient.useActiveOrganization();

  // Handle dashboard navigation with correct organization
  const handleDashboardNav = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeOrganization?.slug) {
      router.push(`/${activeOrganization.slug}`);
    } else {
      // Fallback to default dashboard if no active organization
      router.push("/dashboard");
    }
  };

  // Update user state when session data changes
  useEffect(() => {
    if (!isSessionLoading) {
      if (sessionData?.user) {
        setUser({
          id: sessionData.user.id,
          name: sessionData.user.name,
          email: sessionData.user.email,
          image: sessionData.user.image,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [sessionData, isSessionLoading]);

  return (
    <header className="w-full py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              Comment.video
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            // Loading state
            <div className="flex animate-pulse space-x-2">
              <div className="h-10 w-20 rounded-md bg-muted"></div>
              <div className="h-10 w-20 rounded-md bg-muted"></div>
            </div>
          ) : user ? (
            // Authenticated user - show user menu
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-28 truncate">
                    {user.name || "Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDashboardNav}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <Link
                  href={
                    activeOrganization?.slug
                      ? `/${activeOrganization.slug}/members`
                      : "/members"
                  }
                >
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    Members Area
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    void authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          setUser(null);
                          router.refresh();
                        },
                      },
                    })
                  }
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Not authenticated - show login/signup buttons
            <>
              <Link href="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
