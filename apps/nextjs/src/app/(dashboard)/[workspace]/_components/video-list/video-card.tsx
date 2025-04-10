import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatRelative } from "date-fns";

import type { RouterOutputs } from "@acme/api";
import { toast } from "@acme/ui/toast";

import { useTRPC } from "~/trpc/react";
import { getCDNUrlFromBucketPath } from "~/utils/cdn";
import { VideoActionsDropdown } from "./video-actions-dropdown";
import RenameDialog from "./video-rename-dialog";

export const VideoCard = (props: {
  video: RouterOutputs["video"]["all"][number];
}) => {
  const { video } = props;
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const params = useParams();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deletePost = useMutation(
    trpc.video.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.video.pathFilter());
        toast.success("Video deleted successfully");
      },
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to delete a post"
            : "Failed to delete post",
        );
      },
    }),
  );

  const handleRename = () => {
    setIsRenameDialogOpen(true);
  };

  return (
    <>
      <Link href={`/${params.workspace}/video/${video.id}`}>
        <div className="flex gap-2 rounded-md border hover:bg-accent">
          {video.url && (
            <video
              className="h-24 w-32 rounded-md object-cover"
              src={getCDNUrlFromBucketPath(video.url)}
            />
          )}

          <div className="p-2">
            <p className="text-lg font-semibold tracking-tighter">
              {video.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatRelative(video.createdAt, new Date())}
            </p>
          </div>

          <div className="ml-auto p-2">
            <VideoActionsDropdown
              videoId={video.id}
              onRename={handleRename}
              onDelete={() => deletePost.mutate(video.id)}
            />
          </div>
        </div>
      </Link>

      <RenameDialog
        video={video}
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
      />
    </>
  );
};
