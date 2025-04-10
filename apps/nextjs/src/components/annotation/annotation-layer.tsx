"use client";

import type { Editor } from "tldraw";
import React, { useEffect, useRef } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
import { Tldraw } from "tldraw";

import "tldraw/tldraw.css";

export const TldrawWrapper = () => {
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to update zoom based on container width
  const updateZoomForWindowSize = (editor: Editor) => {
    if (!editor || !containerRef.current) return;

    // Calculate zoom based on container width
    // You can adjust this formula based on your preferences
    const baseWidth = 1920; // baseline width
    const currentWidth = containerRef.current.clientWidth;
    const zoomScale = currentWidth / baseWidth;

    // Get current camera position
    const currentCamera = editor.getCamera();

    // Set the camera zoom using the camera state
    // We maintain x and y positions while only updating z (zoom)
    editor.setCamera(
      {
        x: currentCamera.x,
        y: currentCamera.y,
        z: zoomScale,
      },
      {
        immediate: true,
      },
    );
  };

  // Set up resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    // Create a resize observer to watch the container's size
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (editorRef.current) {
          updateZoomForWindowSize(editorRef.current);
        }
      }
    });

    // Start observing the container
    resizeObserver.observe(containerRef.current);

    // Clean up observer on unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-30" ref={containerRef}>
      <Tldraw
        onMount={(editor) => {
          // Store the editor reference
          editorRef.current = editor;

          editor.setCameraOptions({
            wheelBehavior: "none",
          });

          // Set initial zoom based on container size
          updateZoomForWindowSize(editor);
        }}
      />
    </div>
  );
};

const showAnnotationLayerAtom = atom(false);
export const useShowAnnotationLayer = () => {
  return useAtom(showAnnotationLayerAtom);
};

//TODO make tldraw dyanmic import
export const AnnotationLayer = () => {
  const showAnnotationLayer = useAtomValue(showAnnotationLayerAtom);

  if (!showAnnotationLayer) return null;

  return <TldrawWrapper />;
};
