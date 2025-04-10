import { z } from "zod";

export const messageMetadataSchema = z.object({
  version: z.literal("v1"),
  anonUser: z.object({
    name: z.string(),
  }),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;
