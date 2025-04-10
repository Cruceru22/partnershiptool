"use client";

import React, { useEffect } from "react";

import { Badge } from "@acme/ui/badge";

import { useVideoPlayer } from "../video/video-player";

interface KeyboardShortcutProps {
  className?: string;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutProps> = () => {
  const { remote } = useVideoPlayer();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command + Space to play/pause video
      if (e.shiftKey && e.code === "Space") {
        e.preventDefault();
        remote.togglePaused();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [remote]);

  return (
    <>
      <ShortcutBadge keys={["Shift", "C"]} label="Comment mode" />
      <ShortcutBadge keys={["Shift", "Space"]} label="Play/Pause" />
    </>
  );
};

interface ShortcutBadgeProps {
  keys: string[];
  label: string;
}

const ShortcutBadge: React.FC<ShortcutBadgeProps> = ({ keys, label }) => {
  return (
    <Badge
      variant="outline"
      className="flex items-center gap-1.5 bg-background px-2 py-1"
    >
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold">
              {key}
            </kbd>
          </React.Fragment>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </Badge>
  );
};
