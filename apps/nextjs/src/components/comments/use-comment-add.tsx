"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { RouterOutputs } from "@acme/api";
import { authClient } from "@acme/auth/client";
import { toast } from "@acme/ui/toast";

import { useTRPC } from "~/trpc/react";
import { useReviewerId } from "./comments-wrapper";

export const useCommentAdd = ({ videoId }: { videoId: string }) => {
  const { data: session } = authClient.useSession();

  const { reviewerId } = useReviewerId();

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const createComment = useMutation(
    trpc.comment.create.mutationOptions({
      onMutate: async (newCommentData) => {
        // Cancel any outgoing refetches to avoid overwriting our optimistic update
        await queryClient.cancelQueries(trpc.comment.byVideoId.pathFilter());

        // Snapshot the previous value
        const previousComments = queryClient.getQueryData(
          trpc.comment.byVideoId.queryOptions({ videoId, reviewerId }).queryKey,
        );

        // Create an optimistic comment
        const optimisticComment = {
          id: newCommentData.id,
          content: newCommentData.content,
          startTime: newCommentData.startTime,
          endTime: newCommentData.endTime ?? null,
          videoId: newCommentData.videoId,
          createdAt: new Date(),
          updatedAt: new Date(),
          attachments: null,
          reviewerId,
          reviewer: {
            id: reviewerId,
            user: {
              id: session?.user.id,
              name: session?.user.name,
              email: session?.user.email,
              image: session?.user.image,
            },
          },
        } as RouterOutputs["comment"]["byVideoId"][number];

        // Optimistically update the comments list
        queryClient.setQueryData(
          trpc.comment.byVideoId.queryOptions({ videoId, reviewerId }).queryKey,
          (old) => {
            if (!old) return undefined;

            const newComments = [optimisticComment, ...old];
            const orderByStartTime = newComments.sort(
              (a, b) => Number(a.startTime) - Number(b.startTime),
            );
            return orderByStartTime;
          },
        );

        // Return the context with the previous comments for potential rollback
        return { previousComments };
      },
      onError: (err, newCommentData, context) => {
        // If the mutation fails, roll back to the previous state
        if (context?.previousComments) {
          queryClient.setQueryData(
            trpc.comment.byVideoId.queryOptions({ videoId, reviewerId })
              .queryKey,
            context.previousComments,
          );
        }
        toast.error("Failed to add comment");
      },

      onSettled: async () => {
        // Always refetch after error or success to ensure we have the correct data
        await queryClient.invalidateQueries(trpc.comment.pathFilter());
      },
    }),
  );
  return { createComment };
};
