import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import type { RouterOutputs } from "@acme/api";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/toast";

import { useTRPC } from "~/trpc/react";

interface RenameDialogProps {
  video: RouterOutputs["video"]["all"][number];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const RenameDialog = ({ video, isOpen, onOpenChange }: RenameDialogProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      title: video.title,
    },
    schema: z.object({
      title: z.string().min(1, "Title cannot be empty"),
    }),
  });

  const renameVideo = useMutation(
    trpc.video.rename.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.video.pathFilter());
        toast.success("Video renamed successfully");
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to rename a video"
            : "Failed to rename video",
        );
      },
    }),
  );

  const onSubmit = (data: { title: string }) => {
    console.log("onSubmit", data, video);
    renameVideo.mutate({ id: video.id, title: data.title.trim() });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Video</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="col-span-1">Title</FormLabel>
                    <FormControl>
                      <Input {...field} className="col-span-3" autoFocus />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={renameVideo.isPending}>
                {renameVideo.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default RenameDialog;
