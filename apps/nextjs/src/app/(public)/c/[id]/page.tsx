import React from "react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UserCircle2 } from "lucide-react";

import { auth } from "@acme/auth";
import { Badge } from "@acme/ui/badge";

import { ResizableCommentLayout } from "~/components/resizable-comment-layout";
import { getQueryClient, trpc } from "~/trpc/server";

const CommentPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const queryClient = getQueryClient();

  const { id } = await params;
  const video = await queryClient.fetchQuery(trpc.video.byId.queryOptions(id));

  const data = await auth.api.getSession({
    headers: await headers(),
  });

  const user = data?.user;
  if (!video) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex w-full items-center border-b p-4">
        <Link href="/" className="text-xl font-bold hover:opacity-80">
          comment.video
        </Link>

        {user ? (
          <Badge variant="outline" className="ml-auto flex items-center gap-2">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={32}
                height={32}
                className="rounded-lg"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted-foreground text-background">
                <UserCircle2 className="h-6 w-6" />
              </div>
            )}
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </Badge>
        ) : (
          <Badge variant="outline" className="ml-auto flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted-foreground text-background">
              <UserCircle2 className="h-6 w-6" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Anonymous</span>
              <span className="truncate text-xs">Not signed in</span>
            </div>
          </Badge>
        )}
      </div>
      <ResizableCommentLayout video={video} />
    </div>
  );
};
export default CommentPage;
