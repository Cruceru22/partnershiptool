"use client";

import React, { useEffect, useRef } from "react";
import { useMediaState } from "@vidstack/react";
import { Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { TailwindAdvancedEditor } from "@acme/editor";
import { Button } from "@acme/ui/button";
import { Form, FormField, useForm } from "@acme/ui/form";
import { Icon } from "@acme/ui/icon";

import { useVideoPlayer } from "../video/video-player";
import { useCommentAdd } from "./use-comment-add";

interface CommentAddFormProps {
  videoId: string;
}

export const CommentAddForm: React.FC<CommentAddFormProps> = ({ videoId }) => {
  const form = useForm({
    defaultValues: {
      comment: "",
    },
    schema: z.object({
      comment: z.string().min(1),
    }),
  });

  const { createComment } = useCommentAdd({ videoId });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { instance } = useVideoPlayer();
  const currentTime = useMediaState("currentTime", { current: instance });

  // Add keyboard shortcut for focusing the comment textarea
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command + Enter to focus comment textarea
      if (e.key === "C" && e.shiftKey) {
        e.preventDefault();
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          form.reset();
          createComment.mutate({
            id: uuidv4(),
            videoId,
            content: data.comment,
            startTime: currentTime,
          });
        })}
        className="relative mt-auto flex flex-shrink-0 flex-col gap-2 border-t bg-background"
      >
        {/* <NumberFlow
          format={{
            maximumFractionDigits: 2,
          }}
          value={currentTime}
          className="mx-auto font-bold text-primary"
        /> */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <div className="relative w-full">
              <TailwindAdvancedEditor
                className="h-48 overflow-y-auto px-4 py-4"
                onContentChange={(editor) => {
                  const markdown =
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    editor.storage.markdown.getMarkdown() as string;

                  field.onChange(markdown);
                }}
              />
            </div>
          )}
        />

        <Button className="absolute bottom-2 right-2" type="submit" size="icon">
          <Icon as={Send} className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};
