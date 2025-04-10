"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { StickToBottom } from "use-stick-to-bottom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { Skeleton } from "@acme/ui/skeleton";

import { useTRPC } from "~/trpc/react";
import { CommentAddForm } from "./comment-add-form";
import { CommentsList } from "./comments-list";

// Define a type for mock users
export interface User {
  id: string;
  name: string;
  image: string | null;
}

interface CommentsWrapperProps {
  videoId: string;
}

export const reviewerIdAtom = atom<string | null>(null);

// Define sorting options type
export type SortOption = {
  field: "startTime" | "createdAt";
  direction: "asc" | "desc";
} | null;

export const sortOptionAtom = atom<SortOption>(null);

export const useReviewerId = () => {
  const [reviewerId, setReviewerId] = useAtom(reviewerIdAtom);
  return { reviewerId, setReviewerId };
};

export const useSortOption = () => {
  const [sortOption, setSortOption] = useAtom(sortOptionAtom);
  return { sortOption, setSortOption };
};

export const CommentsWrapper: React.FC<CommentsWrapperProps> = ({
  videoId,
}) => {
  const trpc = useTRPC();

  const { reviewerId, setReviewerId } = useReviewerId();
  const { sortOption, setSortOption } = useSortOption();
  const { data: reviewers } = useQuery(
    trpc.reviewer.byVideoId.queryOptions(videoId),
  );

  if (!reviewers)
    return (
      <div className="flex w-full gap-2 border-b">
        <Skeleton className="h-9 w-full rounded-none" />
      </div>
    );

  return (
    <StickToBottom className="flex h-full flex-col">
      <StickToBottom.Content className="flex flex-col gap-2">
        <div className="flex w-full border-b bg-background">
          <Select
            value={reviewerId ?? "all"}
            onValueChange={(value) => {
              if (value === "all") return setReviewerId(null);
              setReviewerId(value);
            }}
          >
            <SelectTrigger className="w-full rounded-none border-none">
              <SelectValue placeholder="Select reviewer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {reviewers.map((reviewer) => (
                <SelectItem key={reviewer.id} value={reviewer.id}>
                  {reviewer.user?.name ?? reviewer.anonUserId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              !sortOption
                ? "default"
                : `${sortOption.field}_${sortOption.direction}`
            }
            onValueChange={(value) => {
              if (value === "default") {
                setSortOption(null);
                return;
              }

              const [field, direction] = value.split("_") as [
                "startTime" | "createdAt",
                "asc" | "desc",
              ];

              setSortOption({ field, direction });
            }}
          >
            <SelectTrigger className="w-full rounded-none border-none">
              <SelectValue placeholder="Sort comments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default order</SelectItem>
              <SelectItem value="startTime_asc">
                Start time (earliest first)
              </SelectItem>
              <SelectItem value="startTime_desc">
                Start time (latest first)
              </SelectItem>
              <SelectItem value="createdAt_asc">
                Created date (oldest first)
              </SelectItem>
              <SelectItem value="createdAt_desc">
                Created date (newest first)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-full min-h-0">
          <CommentsList
            videoId={videoId}
            reviewerId={reviewerId}
            sortOption={sortOption}
          />
        </div>
      </StickToBottom.Content>
      <CommentAddForm videoId={videoId} />
    </StickToBottom>
  );
};
