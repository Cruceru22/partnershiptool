import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq } from "@acme/db";
import { VideoComment } from "@acme/db/schema";

import { checkLimitsPublic, makeReviewer } from "../rate-limit";
import { protectedProcedure, publicProcedure } from "../trpc";

export const commentRouter = {
  byVideoId: publicProcedure
    .input(
      z.object({
        videoId: z.string(),
        reviewerId: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.db.query.VideoComment.findMany({
        where: input.reviewerId
          ? and(
              eq(VideoComment.videoId, input.videoId),
              eq(VideoComment.reviewerId, input.reviewerId),
            )
          : eq(VideoComment.videoId, input.videoId),
        orderBy: (videoComment, { desc }) => [desc(videoComment.createdAt)],
        with: {
          reviewer: {
            with: {
              user: true,
            },
          },
        },
      });

      const sortedComments = comments.sort((a, b) => {
        return (a.startTime ?? 0) - (b.startTime ?? 0);
      });

      return sortedComments;
    }),

  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        videoId: z.string(),
        content: z.string(),
        startTime: z.number(),
        endTime: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const checkLimitsData = await checkLimitsPublic(
        ctx,
        "comments",
        5,
        "10s",
      );

      const reviewer = await makeReviewer(
        ctx.db,
        checkLimitsData,
        input.videoId,
      );

      return ctx.db
        .insert(VideoComment)
        .values({
          id: input.id,
          videoId: input.videoId,
          content: input.content,
          startTime: input.startTime,
          endTime: input.endTime,
          reviewerId: reviewer.id,
        })
        .returning({ id: VideoComment.id });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(VideoComment).where(eq(VideoComment.id, input));
    }),
} satisfies TRPCRouterRecord;
