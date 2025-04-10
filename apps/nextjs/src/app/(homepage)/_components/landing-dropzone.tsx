"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { Upload, Video } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Progress } from "@acme/ui/progress";
import { toast } from "@acme/ui/toast";

import type { UploadState } from "~/hooks/useMultipartUpload";
import { useMultipartUpload } from "~/hooks/useMultipartUpload";
import { useTRPC } from "~/trpc/react";

interface LandingDropzoneProps {
  onUploadComplete?: (videoId: string) => void;
  className?: string;
}

export function LandingDropzone({
  onUploadComplete,
  className,
}: LandingDropzoneProps) {
  const trpc = useTRPC();
  const { mutateAsync: createVideo } = useMutation(
    trpc.video.create.mutationOptions(),
  );

  const [uploadState, setUploadState] = useState<UploadState>({
    uploaded: 0,
    total: 0,
    percentage: 0,
    error: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const { uploadFile } = useMultipartUpload();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a video file");
        return;
      }

      try {
        setIsUploading(true);
        // Generate a unique ID for this video

        const newVideoId = await createVideo({
          title: file.name,
        });

        const id = newVideoId[0]?.id;

        if (!id) {
          throw new Error("Failed to create video");
        }

        // Start upload
        const uploadedVideoId = await uploadFile(file, {
          videoId: id,
          onProgress: (state) => {
            setUploadState(state);
            if (state.error) {
              toast.error(`Upload failed: ${state.error}`);
              setIsUploading(false);
            }
          },
          onError: (error) => {
            toast.error(`Upload error: ${error.message}`);
            setIsUploading(false);
          },
        });

        toast.success("Video uploaded successfully!");
        onUploadComplete?.(uploadedVideoId);
        setIsUploading(false);
      } catch (error) {
        // Error is already handled by onError callback
        setIsUploading(false);
      }
    },
    [uploadFile, onUploadComplete],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [],
    },
    multiple: false,
    disabled: isUploading,
  });

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 p-2",
          isDragActive
            ? "border-primary bg-primary/10 ring-2 ring-primary/30"
            : "border-border transition-colors hover:border-primary/50 hover:bg-muted/50",
          isUploading && "pointer-events-none opacity-60",
        )}
      >
        <input {...getInputProps()} />

        {isUploading && (
          <div className="absolute inset-0 z-30 flex w-full flex-col items-center justify-center">
            <div className="mx-auto flex w-full max-w-sm flex-col gap-2 p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-medium">Uploading video...</p>
                <span className="font-medium text-primary">
                  {uploadState.percentage.toFixed(0)}%
                </span>
              </div>
              <Progress value={uploadState.percentage} className="h-3 w-full" />
              <p className="text-xs text-muted-foreground">
                {(uploadState.uploaded / (1024 * 1024)).toFixed(2)} MB of{" "}
                {(uploadState.total / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}
        <>
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <Image
              fill
              src="/empathy.png"
              className="object-cover blur-lg"
              alt="Video placeholder"
            />
          </div>
          <div className="z-10 flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-background py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full p-3">
              {isDragActive ? (
                <Video
                  className={cn(
                    "h-8 w-8 text-primary transition-transform duration-300",
                    "scale-110",
                  )}
                />
              ) : (
                <Upload className="h-12 w-12 text-primary transition-transform duration-300" />
              )}
            </div>

            <div className="text-center">
              <p className="mb-2 text-base font-medium">
                {isDragActive
                  ? "Drop your video here"
                  : "Drag and drop a video file"}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports MP4, MOV, AVI and most other formats
              </p>
            </div>

            <Button variant="outline">Browse files</Button>
          </div>
        </>
      </div>

      {uploadState.error && (
        <div className="mt-4 rounded border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {uploadState.error}
        </div>
      )}
    </div>
  );
}
