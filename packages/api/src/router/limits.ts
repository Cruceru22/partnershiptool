import { Redis } from "@upstash/redis";

import {
  getImportLimitKey,
  getUploadSizeLimitKey,
} from "@acme/validators/limits";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const redis = Redis.fromEnv();

export const limitsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.session.activeOrganizationId) {
      throw new Error("No active organization");
    }

    const [uploadLimit, importLimit] = await redis.mget<[number, number]>(
      getUploadSizeLimitKey(ctx.session.session.activeOrganizationId),
      getImportLimitKey(ctx.session.session.activeOrganizationId),
    );

    return {
      uploadLimit,
      importLimit,
    };
  }),
});
