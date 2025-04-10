"use client";

import type { MediaErrorDetail, MediaPlayerInstance } from "@vidstack/react";
import React from "react";
import { MediaPlayer, MediaProvider, useMediaRemote } from "@vidstack/react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { atom, useAtomValue, useSetAtom } from "jotai";

import { Card } from "@acme/ui/card";

import { cn } from "~/lib/utils";
import { makeCDNUrl } from "~/utils/cdn";
import { StandaloneFilmstrip } from "./standalone-filmstrip";

export const instanceAtom = atom<MediaPlayerInstance | null>(null);

export const useVideoPlayer = () => {
  const instance = useAtomValue(instanceAtom);
  const remote = useMediaRemote(instance);

  const seek = (time: number) => {
    if (instance) {
      remote.seek(time);
    }
  };

  return { seek, instance, remote };
};

interface VideoPlayerProps {
  id: string;
  url: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  id,
  url,
  className,
}) => {
  const setInstance = useSetAtom(instanceAtom);
  const [error, setError] = React.useState<Error | null>(null);
  const [_, setIsLoading] = React.useState(true);

  const handleError = (detail: MediaErrorDetail) => {
    console.error("Video player error details:", {
      detail,
      message: detail.message,
      code: detail.code,
      mediaError: detail.mediaError,
      url,
    });

    let errorMessage = "Failed to load video";

    if (detail.code === 1) {
      errorMessage = "Video fetch was aborted";
    } else if (detail.code === 2) {
      errorMessage = "Network error occurred while loading video";
    } else if (detail.code === 3) {
      errorMessage = "Error decoding video";
    } else if (detail.code === 4) {
      errorMessage = "Video format not supported";
    }

    setError(new Error(errorMessage));
    setIsLoading(false);
  };

  if (error) {
    return (
      <Card className="flex h-[350px] w-full items-center justify-center rounded-none bg-muted">
        <div className="text-center">
          <p className="text-destructive">{error.message}</p>
          <p className="mt-2 text-sm text-muted-foreground">URL: {url}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <MediaPlayer
        ref={(ref) => setInstance(ref)}
        className={cn("vds-video-layout w-full", className)}
        src={url}
        onError={handleError}
        crossOrigin="anonymous"
      >
        <MediaProvider />

        {/* Fluted glass overlay */}
        {/* <div className="pointer-events-none absolute inset-0 z-10 backdrop-blur-[2px]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.07) 2px, rgba(255, 255, 255, 0.07) 4px)",
              mixBlendMode: "overlay",
              backdropFilter: "blur(5px)",
            }}
          ></div>
        </div> */}

        <DefaultAudioLayout icons={defaultLayoutIcons} />
        <DefaultVideoLayout
          thumbnails={makeCDNUrl(`${id}/thumbnails/root.vtt`)}
          icons={defaultLayoutIcons}
        />
      </MediaPlayer>

      {/* Standalone filmstrip timeline below the player */}
      <StandaloneFilmstrip id={id} className="p-4" />
    </div>
  );
};
