import type { TRPCRouterRecord } from "@trpc/server";
import {
  InvocationType,
  InvokeCommand,
  LambdaClient,
} from "@aws-sdk/client-lambda";
import { z } from "zod";

import { eq } from "@acme/db";
import { Video } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const videoRouter = {
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.session.activeOrganizationId) {
        throw new Error("No active organization");
      }
      return ctx.db
        .insert(Video)
        .values({
          title: input.title,
          organizationId: ctx.session.session.activeOrganizationId,
        })
        .returning({ id: Video.id });
    }),
  all: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.session.activeOrganizationId) {
      throw new Error("No active organization");
    }
    return ctx.db.query.Video.findMany({
      where: eq(Video.organizationId, ctx.session.session.activeOrganizationId),
    });
  }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(Video).where(eq(Video.id, input));
    }),
  rename: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(Video)
        .set({ title: input.title })
        .where(eq(Video.id, input.id))
        .returning({ id: Video.id });
    }),
  byId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.query.Video.findFirst({
      where: eq(Video.id, input),
    });
  }),
  thumbnailCheck: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const video = await ctx.db.query.Video.findFirst({
        where: eq(Video.id, input),
      });

      if (!video) {
        throw new Error("Video not found");
      }

      const url = video.url;

      if (!url) {
        throw new Error("Video URL not found");
      }

      // Extract key from URL
      // Assuming URL format is something like: https://example.com/path/to/key
      const urlParts = url.split("/");
      const key = `${input}/${urlParts[urlParts.length - 1]}`;

      // Initialize the Lambda client
      const lambdaClient = new LambdaClient(); // Replace with your AWS region

      // Prepare the Lambda invocation parameters
      const params = {
        FunctionName:
          "comment-video-production-GenerateThumbnailsFunction-mvwebmet", // Replace with your actual Lambda function name
        InvocationType: InvocationType.RequestResponse,
        Payload: JSON.stringify({ key }),
      };

      // Invoke the Lambda function
      const command = new InvokeCommand(params);
      const response = await lambdaClient.send(command);

      // Process the response
      let responsePayload = {};
      if (response.Payload) {
        const textDecoder = new TextDecoder();
        const jsonString = textDecoder.decode(response.Payload);
        responsePayload = JSON.parse(jsonString);
      }

      return {
        success: true,
        key,
        response: responsePayload,
      };
    }),
} satisfies TRPCRouterRecord;
