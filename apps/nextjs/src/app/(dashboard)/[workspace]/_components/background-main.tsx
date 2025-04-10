"use client";

import type { Palette } from "@vibrant/color";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { Vibrant } from "node-vibrant/browser";
import { useThrottledCallback } from "use-debounce";

import { useVideoPlayer } from "~/components/video/video-player";

export const BackgroundMain = () => {
  const params = useParams();
  const { instance } = useVideoPlayer();

  const [palette, setPalette] = useState<Palette | null>(null);

  // Create motion value for smooth color transitions
  const firstMotion = useMotionValue(palette?.DarkMuted?.hex ?? "#1a1a1a");
  const secondMotion = useMotionValue(palette?.Vibrant?.hex ?? "#2a2a2a");
  const thirdMotion = useMotionValue(palette?.LightVibrant?.hex ?? "#3a3a3a");

  // Create gradient template using the motion values
  const bottomGradient = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, transparent 50%, ${firstMotion})`;
  const topGradient = useMotionTemplate`radial-gradient(80% 80% at 100% 100%, transparent 50%, ${secondMotion})`;
  const coolGradient = useMotionTemplate`radial-gradient(70% 70% at 0% 100%, transparent 50%, ${thirdMotion})`;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animate color changes when colors update
  useEffect(() => {
    animate(firstMotion, palette?.DarkMuted?.hex ?? "#1a1a1a", {
      duration: 1.5,
      ease: "easeOut",
    });

    animate(secondMotion, palette?.Vibrant?.hex ?? "#2a2a2a", {
      duration: 1.5,
      ease: "easeOut",
    });

    animate(thirdMotion, palette?.LightVibrant?.hex ?? "#3a3a3a", {
      duration: 1.5,
      ease: "easeOut",
    });
  }, [palette, firstMotion, secondMotion, thirdMotion]);

  useEffect(() => {
    // Create a canvas element for capturing video frames
    if (!canvasRef.current) {
      const canvas = document.createElement("canvas");
      canvasRef.current = canvas;
    }
  }, []);

  const throttleProcessVideoFrame = useThrottledCallback(() => {
    if (!instance || !canvasRef.current) return;

    const processVideoFrame = async () => {
      try {
        // Get the video element from the instance
        const videoElement = instance.el?.querySelector("video");
        if (!videoElement || videoElement.readyState < 2) return; // Not ready to capture

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas dimensions to match video
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        // Draw the current video frame to the canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

        // Use the data URL with Vibrant
        const vibrant = new Vibrant(dataUrl);
        const palette = await vibrant.getPalette();

        setPalette(palette);
      } catch (error) {
        console.error("Error processing video frame:", error);
      }
    };

    void processVideoFrame();
  }, 500);

  useEffect(() => {
    if (!instance || !canvasRef.current) return;

    const timeUpdateDispose = instance.listen("time-update", () => {
      throttleProcessVideoFrame();
    });

    const dispose = () => {
      timeUpdateDispose();
    };

    return () => {
      dispose();
    };
  }, [instance, throttleProcessVideoFrame]);

  if (!params.id) return null;

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 opacity-10 dark:opacity-10"
          style={{ backgroundImage: bottomGradient }}
        />
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: topGradient }}
        />
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: coolGradient }}
        />
      </div>
    </>
  );
};
