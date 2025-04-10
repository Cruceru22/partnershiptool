"use client";

import React from "react";
import { formatRelative } from "date-fns";
import { proseTw } from "node_modules/@acme/editor/src/styles";
import Markdown from "react-markdown";

import type { RouterOutputs } from "@acme/api";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Button } from "@acme/ui/button";

import { cn } from "~/lib/utils";
import { useVideoPlayer } from "../video/video-player";
import { CommentHourglass } from "./comment-hourglass";
import { CommentItemDropdown } from "./comment-item-dropdown";

interface CommentItemProps {
  comment: RouterOutputs["comment"]["byVideoId"][number];
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m ${remainingSeconds.toString().padStart(2, "0")}s`;
  }
  return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`;
};

export const CommentItem = ({ comment }: CommentItemProps) => {
  const { seek } = useVideoPlayer();

  const userImage = comment.reviewer?.user?.image ?? undefined;
  const userName = comment.reviewer?.user?.name ?? comment.reviewer?.anonUserId;

  return (
    <div className="relative flex flex-col gap-2 rounded-md border bg-background p-4">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          {userImage && <AvatarImage src={userImage} />}
          <AvatarFallback>{userName?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{userName}</span>
          <span className="text-xs text-muted-foreground">
            {formatRelative(new Date(comment.createdAt), new Date())}
          </span>
        </div>
      </div>

      <div className={cn(proseTw)}>
        <Markdown>{comment.content}</Markdown>
      </div>

      <div className="flex items-center justify-between gap-1">
        <Button
          onClick={() => seek(Number(comment.startTime))}
          variant="outline"
          size="xs"
          className="flex w-fit items-center gap-1.5 font-mono"
        >
          {formatTime(Number(comment.startTime))}
        </Button>
        {comment.startTime && (
          <Button
            className="h-6 w-6 text-muted-foreground"
            size="icon"
            variant="ghost"
            onClick={() => seek(Number(comment.startTime))}
          >
            <CommentHourglass seconds={Number(comment.startTime)} />
          </Button>
        )}
      </div>
      <CommentItemDropdown comment={comment} />
    </div>
  );
};
