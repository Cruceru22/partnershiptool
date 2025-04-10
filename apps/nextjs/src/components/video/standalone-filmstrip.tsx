/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaState } from "@vidstack/react";

import { makeCDNUrl } from "~/utils/cdn";
import { useVideoPlayer } from "./video-player";

interface StandaloneFilmstripProps {
  id: string;
  className?: string;
  thumbnailCount?: number;
  thumbnailHeight?: number;
}

export const StandaloneFilmstrip = ({
  id,
  className,
  thumbnailCount = 10,
  thumbnailHeight = 64,
}: StandaloneFilmstripProps) => {
  const { instance, seek } = useVideoPlayer();
  const [thumbnails, setThumbnails] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get duration from the player when available

  const duration = useMediaState("duration", { current: instance });

  const handleUpdate = useCallback(() => {
    if (!instance) return;
    const currentTime = instance.state.currentTime;
    const duration = instance.state.duration;

    if (duration > 0) {
      setProgress(currentTime / duration);
      const timestamps = Array.from({ length: thumbnailCount }).map(
        (_, index) => {
          return Math.floor((duration / thumbnailCount) * index);
        },
      );
      setThumbnails(timestamps);
    }
  }, [instance, thumbnailCount]);

  useEffect(() => {
    handleUpdate();
  }, [duration, handleUpdate]);

  useEffect(() => {
    if (!instance) return;

    // Listen for timeupdate and durationchange events
    const timeUpdateDispose = instance.listen("time-update", handleUpdate);

    return () => {
      // Clean up event listeners
      timeUpdateDispose();
    };
  }, [handleUpdate, instance, thumbnailCount]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || thumbnails.length === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    setHoverPosition(Math.max(0, Math.min(1, position)));

    // Calculate the time based on position and seek to it when clicked
    if (instance) {
      const duration = instance.state.duration;
      if (duration > 0) {
        const time = duration * position;
        setPreviewTime(time);
        setShowPreview(true);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    setShowPreview(false);
  };

  const handleClick = () => {
    if (hoverPosition !== null && instance) {
      const duration = instance.state.duration;
      if (duration > 0) {
        const time = duration * hoverPosition;
        seek(time);
      }
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={containerRef}
        className="relative h-16 w-full cursor-pointer overflow-hidden rounded-md border bg-muted"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Filmstrip */}
        <div className="absolute flex h-full w-full">
          {thumbnails.map((time, index) => (
            <div
              key={index}
              className="relative h-full"
              style={{
                width: `${100 / thumbnailCount}%`,
                height: thumbnailHeight,
              }}
            >
              <img
                src={`${makeCDNUrl(`${id}/thumbnails/${time}.jpg`)}`}
                alt={`Thumbnail at ${formatTime(time)}`}
                className="h-full w-full object-cover opacity-60"
              />
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div
          className="absolute bottom-0 left-0 top-0 bg-background/50"
          style={{ width: `${progress * 100}%` }}
        />

        {/* Hover position indicator */}
        {hoverPosition !== null && (
          <div
            className="absolute bottom-0 top-0 w-0.5 bg-primary"
            style={{ left: `${hoverPosition * 100}%` }}
          />
        )}

        {/* Preview thumbnail */}
        {showPreview && (
          <div
            className="absolute bottom-full mb-2 -translate-x-1/2 overflow-hidden rounded-sm border border-border bg-background/90 shadow-md"
            style={{
              left: `${(hoverPosition ?? 0) * 100}%`,
              zIndex: 30,
              width: "160px",
              height: "90px",
            }}
          >
            <div className="h-full w-full">
              <img
                src={`${makeCDNUrl(`${id}/thumbnails/${Math.floor(previewTime)}.jpg`)}`}
                alt={`Preview at ${formatTime(previewTime)}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 w-full bg-background/80 px-2 py-1 text-xs text-white">
              {formatTime(previewTime)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  if (!seconds) return "0:00";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  } else {
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
}
