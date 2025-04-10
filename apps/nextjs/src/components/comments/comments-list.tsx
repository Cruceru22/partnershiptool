"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

import { Card, CardContent } from "@acme/ui/card";
import { Skeleton } from "@acme/ui/skeleton";

import type { SortOption } from "./comments-wrapper";
import { useTRPC } from "~/trpc/react";
import { CommentItem } from "./comment-item";

interface CommentsListProps {
  videoId: string;
  reviewerId: string | null;
  sortOption: SortOption;
}

export const CommentsList: React.FC<CommentsListProps> = ({
  videoId,
  reviewerId,
  sortOption,
}) => {
  const trpc = useTRPC();

  const { data: comments } = useQuery(
    trpc.comment.byVideoId.queryOptions({
      videoId,
      reviewerId,
    }),
  );

  if (!comments) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="rounded-none">
            <CardContent className="p-4">
              <div className="mb-4 flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!comments.length) return null;

  // Apply sorting based on sortOption
  const sortedComments = [...comments];

  if (sortOption) {
    sortedComments.sort((a, b) => {
      const { field, direction } = sortOption;
      const multiplier = direction === "asc" ? 1 : -1;

      if (field === "startTime") {
        return (a.startTime - b.startTime) * multiplier;
      }

      return (
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
        multiplier
      );

      return 0;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-full flex-col gap-2 p-4 pb-12">
        {sortedComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};
