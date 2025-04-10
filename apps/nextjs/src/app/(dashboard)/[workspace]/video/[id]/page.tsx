import React from "react";
import { notFound } from "next/navigation";

import { ResizableCommentLayout } from "~/components/resizable-comment-layout";
import { getQueryClient, trpc } from "~/trpc/server";

interface VideoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VideoPage({ params }: VideoPageProps) {
  const queryClient = getQueryClient();

  const { id } = await params;
  const video = await queryClient.fetchQuery(trpc.video.byId.queryOptions(id));

  if (!video) {
    notFound();
  }

  return <ResizableCommentLayout video={video} />;
}
