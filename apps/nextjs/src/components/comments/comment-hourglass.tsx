import React from "react";
import { useMediaState } from "@vidstack/react";

import { cn } from "~/lib/utils";
import { useVideoPlayer } from "../video/video-player";

interface CommentHourglassProps {
  seconds: number; // Value between 0 and 1
  color?: string;
  fillColor?: string;
  className?: string;
}

export const CommentHourglass: React.FC<CommentHourglassProps> = ({
  seconds = 0,
  color = "currentColor",
  fillColor = "currentColor",
  className,
}) => {
  const { instance } = useVideoPlayer();
  const duration = useMediaState("duration", {
    current: instance,
  });

  const progress = seconds / duration;
  // Ensure progress is between 0 and 1

  const normalizedProgress = Math.max(0, Math.min(1, progress));

  // Calculate the fill height for the bottom part of the hourglass
  // Bottom half is 50% of the total height
  const bottomFillHeight =
    normalizedProgress <= 0.5 ? normalizedProgress * 2 * 100 : 100;

  // Calculate the fill height for the top part of the hourglass
  // Only start filling the top when bottom is full (progress > 0.5)
  const topFillHeight =
    normalizedProgress <= 0.5 ? 0 : (normalizedProgress - 0.5) * 2 * 100;

  return (
    <div className={cn("relative h-4 w-4", className)}>
      {/* Outline hourglass */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 z-10"
      >
        <path d="M5 22h14" />
        <path d="M5 2h14" />
        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
      </svg>

      {/* Bottom fill */}
      {normalizedProgress > 0 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill={fillColor}
          className="absolute inset-0"
        >
          <clipPath id="bottomFill">
            <path d="M7 22v-4.172a2 2 0 0 1 .586-1.414L12 12l4.414 4.414A2 2 0 0 1 17 17.828V22H7z" />
          </clipPath>
          <rect
            x="7"
            y={22 - bottomFillHeight * 0.1}
            width="10"
            height={bottomFillHeight * 0.1}
            clipPath="url(#bottomFill)"
          />
        </svg>
      )}

      {/* Top fill - only visible when progress > 0.5 */}
      {normalizedProgress > 0.5 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill={fillColor}
          className="absolute inset-0"
        >
          <clipPath id="topFill">
            <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2H7z" />
          </clipPath>
          <rect
            x="7"
            y="2"
            width="10"
            height={topFillHeight * 0.1}
            clipPath="url(#topFill)"
          />
        </svg>
      )}
    </div>
  );
};
