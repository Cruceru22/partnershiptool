"use client";

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";
import { VideoCard } from "./video-card";

export const VideoList = () => {
  const trpc = useTRPC();
  const { data: videos } = useSuspenseQuery(trpc.video.all.queryOptions());

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => {
        return <VideoCard key={video.id} video={video} />;
      })}
    </div>
  );
};
