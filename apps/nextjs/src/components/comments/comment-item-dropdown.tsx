"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, MoreVertical, Trash } from "lucide-react";

import type { RouterOutputs } from "@acme/api";
import { authClient } from "@acme/auth/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { Icon } from "@acme/ui/icon";
import { toast } from "@acme/ui/toast";

import { useTRPC } from "~/trpc/react";

interface CommentItemDropdownProps {
  comment: RouterOutputs["comment"]["byVideoId"][number];
  onEdit?: () => void;
}

export const CommentItemDropdown = ({
  comment,
  onEdit,
}: CommentItemDropdownProps) => {
  const { data: session } = authClient.useSession();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Check if the current user is the owner of the comment
  const isOwner = session?.user.id === comment.reviewer?.user?.id;

  const deleteComment = useMutation(
    trpc.comment.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Comment deleted successfully");
        // Invalidate the comments query to refresh the list
        void queryClient.invalidateQueries(trpc.comment.byVideoId.pathFilter());
      },
      onError: () => {
        toast.error("Failed to delete comment");
      },
    }),
  );

  if (!isOwner) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent">
        <Icon as={MoreVertical} className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <Icon as={Edit} className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => deleteComment.mutate(comment.id)}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Icon as={Trash} className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
