import type { TRPCRouterRecord } from "@trpc/server";
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Plan } from "@acme/validators/plans";
import { eq } from "@acme/db";
import { subscription, Video } from "@acme/db/schema";
import { checkUploadLimit } from "@acme/validators/redis";

import { protectedProcedure } from "../trpc";

const bucketName = process.env.AWS_BUCKET_NAME;
const maxMB = 700;

export const awsRouter = {
  initiateMultipartUpload: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        parts: z.number(),
        contentLength: z.number(),
        fileExtension: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.session.activeOrganizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be in an organization to upload a video",
        });
      }

      const sub = await ctx.db.query.subscription.findFirst({
        where: eq(
          subscription.referenceId,
          ctx.session.session.activeOrganizationId,
        ),
      });

      // Convert content length from bytes to MB for consistent comparison
      const contentLengthInMB = Math.ceil(input.contentLength / (1024 * 1024));

      const organizationId = ctx.session.session.activeOrganizationId;
      if (!organizationId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be in an organization to upload a video",
        });
      }

      const limitExceeded = await checkUploadLimit(
        (sub?.plan ?? "free") as Plan,
        organizationId,
        contentLengthInMB,
      );

      if (limitExceeded) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have reached your upload limit",
        });
      }

      const key = `${input.videoId}/video.${input.fileExtension}`;

      if (contentLengthInMB > maxMB) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `File is too large. Maximum size is ${maxMB} MB.`,
        });
      }

      const client = new S3Client({
        useAccelerateEndpoint: true,
      });

      const createCommand = new CreateMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
        Metadata: {
          videoid: input.videoId,
          userid: ctx.session.user.id,
        },
      });

      const { UploadId } = await client.send(createCommand);
      if (!UploadId) throw new Error("Failed to initiate multipart upload");

      const signedUrls = await Promise.all(
        Array.from({ length: input.parts }, async (_, index) => {
          const uploadPartCommand = new UploadPartCommand({
            Bucket: bucketName,
            Key: key,
            UploadId,
            PartNumber: index + 1,
          });

          const signedUrl = await getSignedUrl(client, uploadPartCommand, {
            expiresIn: 3600,
          });
          return { url: signedUrl, partNumber: index + 1 };
        }),
      );

      return {
        uploadId: UploadId,
        signedUrls,
      };
    }),
  completeMultipartUpload: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        uploadId: z.string(),
        parts: z.array(
          z.object({
            ETag: z.string(),
            PartNumber: z.number(),
          }),
        ),
        fileExtension: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const key = `${input.videoId}/video.${input.fileExtension}`;

      const client = new S3Client({
        useAccelerateEndpoint: true,
      });

      try {
        const command = new CompleteMultipartUploadCommand({
          Bucket: bucketName,
          Key: key,
          UploadId: input.uploadId,
          MultipartUpload: {
            Parts: input.parts,
          },
        });

        await client.send(command);

        const videoUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;

        await ctx.db
          .update(Video)
          .set({ url: videoUrl })
          .where(eq(Video.id, input.videoId));

        return { success: true, videoUrl };
      } catch (_error) {
        await client.send(
          new AbortMultipartUploadCommand({
            Bucket: bucketName,
            Key: key,
            UploadId: input.uploadId,
          }),
        );
        // Sentry.captureException(_error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to complete multipart upload",
        });
      }
    }),
} satisfies TRPCRouterRecord;
