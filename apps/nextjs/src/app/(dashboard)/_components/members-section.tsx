"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Mail,
  MoreHorizontal,
  Plus,
  Trash,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { Input } from "@acme/ui/input";
import { Skeleton } from "@acme/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import { useTRPC } from "~/trpc/react";

// Define a type for the user
type UserData = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// Define types for organization members and invitations
type OrganizationMember = {
  id: string;
  user: UserData;
  role: string;
  joinedAt: string;
};

type Invitation = {
  id: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "rejected" | "canceled";
  createdAt: string;
  expiresAt: string;
};

type Organization = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
};

export function MembersSection() {
  const [activeTab, setActiveTab] = useState("members");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  // Mock data - in a real app, these would come from API calls
  const [organization, setOrganization] = useState<Organization>({
    id: "org-1",
    name: "Your Organization",
    slug: "your-org",
  });
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // Use tRPC to get the session
  const trpc = useTRPC();
  const { data: sessionData, isLoading: isSessionLoading } = useQuery(
    trpc.auth.getSession.queryOptions(),
  );

  // Populate initial data
  useEffect(() => {
    if (!isSessionLoading && sessionData?.user) {
      // Mock: Add the current user as a member with owner role
      const currentUserMember = {
        id: "member-1",
        user: {
          id: sessionData.user.id,
          name: sessionData.user.name,
          email: sessionData.user.email,
          image: sessionData.user.image,
        },
        role: "owner",
        joinedAt: new Date().toISOString(),
      };

      setMembers([currentUserMember]);
      setIsLoading(false);
    }
  }, [sessionData, isSessionLoading]);

  // Role options for the dropdown
  const roleOptions = [
    {
      value: "admin",
      label: "Admin",
      description: "Admins can manage members, settings, and all resources.",
    },
    {
      value: "member",
      label: "Member",
      description:
        "Members can view and create resources but cannot modify organization settings.",
    },
    {
      value: "guest",
      label: "Guest",
      description:
        "Guests have limited access to specific resources they're assigned to.",
    },
  ];

  // Handle sending invitations
  const handleSendInvite = async () => {
    if (!inviteEmail) {
      toast("Please enter an email address", {
        description: "An email address is required to send an invitation",
      });
      return;
    }

    setIsSendingInvite(true);

    try {
      // Mock: Add to invitations list
      const newInvitation: Invitation = {
        id: `invite-${Date.now()}`,
        email: inviteEmail,
        role: inviteRole,
        status: "pending",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
      };

      setInvitations([...invitations, newInvitation]);

      toast("Invitation sent", {
        description: `Invitation sent to ${inviteEmail}`,
      });

      setInviteEmail("");
      setIsInviteDialogOpen(false);
    } catch (error) {
      toast("Error sending invitation", {
        description: "Failed to send invitation. Please try again.",
      });
    } finally {
      setIsSendingInvite(false);
    }
  };

  // Handle canceling an invitation
  const handleCancelInvitation = (invitationId: string) => {
    // Mock: Update invitation status
    setInvitations(
      invitations.map((inv) =>
        inv.id === invitationId ? { ...inv, status: "canceled" } : inv,
      ),
    );

    toast("Invitation canceled", {
      description: "The invitation has been canceled",
    });
  };

  // Handle resending an invitation
  const handleResendInvitation = (invitation: Invitation) => {
    toast("Invitation resent", {
      description: `Invitation resent to ${invitation.email}`,
    });
  };

  // Handle removing a member
  const handleRemoveMember = (memberId: string) => {
    // Don't remove the current user (owner)
    if (members.find((m) => m.id === memberId)?.role === "owner") {
      toast("Cannot remove owner", {
        description: "You cannot remove the organization owner",
      });
      return;
    }

    // Mock: Remove from members list
    setMembers(members.filter((member) => member.id !== memberId));

    toast("Member removed", {
      description: "The member has been removed from your organization",
    });
  };

  if (isLoading || isSessionLoading) {
    return <MembersSectionSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Members</h2>
          <p className="text-muted-foreground">
            Manage your team members and their access
          </p>
        </div>

        <div className="mt-4 flex items-center gap-4 md:mt-0">
          <Dialog
            open={isInviteDialogOpen}
            onOpenChange={setIsInviteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gap-1">
                <UserPlus className="h-4 w-4" />
                <span>Invite Member</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite new member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your team. They'll receive an email
                  with instructions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </label>
                  <Input
                    id="email"
                    placeholder="colleague@example.com"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Role
                  </label>
                  <div>
                    <select
                      id="role"
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">
                      {roleOptions.find((o) => o.value === inviteRole)
                        ?.description || ""}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendInvite}
                  disabled={isSendingInvite || !inviteEmail}
                >
                  {isSendingInvite ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Invitation"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Members</span>
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Invitations</span>
            {invitations.filter((inv) => inv.status === "pending").length >
              0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {invitations.filter((inv) => inv.status === "pending").length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your team members and their roles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <Users className="h-12 w-12 text-muted-foreground/80" />
                    <h3 className="mt-4 text-lg font-semibold">
                      No members yet
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You don't have any team members yet.
                      <br />
                      Start by inviting colleagues or team members.
                    </p>
                    <Button
                      className="mt-4 gap-1"
                      onClick={() => setIsInviteDialogOpen(true)}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Invite Members</span>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between py-4"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage
                              src={member.user.image ?? ""}
                              alt={member.user.name ?? ""}
                            />
                            <AvatarFallback>
                              {member.user.name?.charAt(0).toUpperCase() ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {member.user.name || "Unknown User"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.user.email}
                            </p>
                            <div className="mt-1 flex items-center">
                              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                                {member.role}
                              </span>
                              {member.role === "owner" && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  (You)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {member.role !== "owner" && (
                              <>
                                <DropdownMenuItem
                                  disabled={member.role === "owner"}
                                >
                                  <UserCog className="mr-2 h-4 w-4" />
                                  <span>Change role</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleRemoveMember(member.id)}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Remove</span>
                                </DropdownMenuItem>
                              </>
                            )}
                            {member.role === "owner" && (
                              <DropdownMenuItem disabled>
                                <span className="text-muted-foreground">
                                  Team owner
                                </span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
              <p className="text-sm text-muted-foreground">
                {members.length} member{members.length !== 1 ? "s" : ""} in team
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => setIsInviteDialogOpen(true)}
              >
                <UserPlus className="h-3 w-3" />
                <span>Invite</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="invitations">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Manage sent invitations and their status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invitations.filter((inv) => inv.status === "pending")
                  .length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <Mail className="h-12 w-12 text-muted-foreground/80" />
                    <h3 className="mt-4 text-lg font-semibold">
                      No pending invitations
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You don't have any pending invitations.
                      <br />
                      Invite new team members to collaborate.
                    </p>
                    <Button
                      className="mt-4 gap-1"
                      onClick={() => setIsInviteDialogOpen(true)}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Invite Members</span>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {invitations
                      .filter((inv) => inv.status === "pending")
                      .map((invitation) => (
                        <div
                          key={invitation.id}
                          className="flex items-center justify-between py-4"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                              <Mail className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{invitation.email}</p>
                              <div className="mt-1 flex items-center">
                                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                                  {invitation.role}
                                </span>
                                <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                                  Pending
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResendInvitation(invitation)}
                            >
                              Resend
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCancelInvitation(invitation.id)
                              }
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Cancel invitation</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MembersSectionSkeleton() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-60" />
      </div>

      <Skeleton className="mb-4 h-10 w-48" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}
