import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "../trpc";

export const reviewerRouter = {
  byVideoId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const reviewers = await ctx.db.query.Reviewers.findMany({
      where: (reviewer, { eq }) => eq(reviewer.videoId, input),
      with: {
        user: true,
      },
    });

    return reviewers;
  }),
} satisfies TRPCRouterRecord;
