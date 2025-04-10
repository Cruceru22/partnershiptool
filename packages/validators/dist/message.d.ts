import { z } from "zod";
export declare const messageMetadataSchema: z.ZodObject<{
    version: z.ZodLiteral<"v1">;
    anonUser: z.ZodObject<{
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
    }, {
        name: string;
    }>;
}, "strip", z.ZodTypeAny, {
    version: "v1";
    anonUser: {
        name: string;
    };
}, {
    version: "v1";
    anonUser: {
        name: string;
    };
}>;
export type MessageMetadata = z.infer<typeof messageMetadataSchema>;
//# sourceMappingURL=message.d.ts.map