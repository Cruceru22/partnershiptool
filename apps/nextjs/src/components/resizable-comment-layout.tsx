import React from "react";

import type { RouterOutputs } from "@acme/api";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@acme/ui/resizable";

import { getCDNUrlFromBucketPath } from "~/utils/cdn";
import { CommentsWrapper } from "./comments/comments-wrapper";
// import { AnnotationLayer } from "./annotation/annotation-layer";
// import { AnnotationShowButton } from "./annotation/annotation-show-button";
import { KeyboardShortcuts } from "./shortcuts/keyboard-shortcuts";
import { VideoPlayer } from "./video/video-player";

interface ResizableCommentLayoutProps {
  video: NonNullable<RouterOutputs["video"]["byId"]>;
}

export const ResizableCommentLayout = ({
  video,
}: ResizableCommentLayoutProps) => {
  return (
    <div className="relative flex h-full min-h-0 flex-col gap-8">
      <div className="hidden h-full min-h-0 flex-col gap-8 lg:flex">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={70}>
            <div className="flex h-full flex-col">
              {video.url && (
                <div className="relative flex flex-col">
                  <VideoPlayer
                    id={video.id}
                    url={getCDNUrlFromBucketPath(video.url)}
                  />
                  {/* <AnnotationLayer /> */}
                </div>
              )}
              <div className="mt-auto flex gap-2 p-4">
                <KeyboardShortcuts />
                {/* <AnnotationShowButton /> */}
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30}>
            <CommentsWrapper videoId={video.id} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
