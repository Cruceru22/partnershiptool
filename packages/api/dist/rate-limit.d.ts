import type { Duration } from "@upstash/ratelimit";
import type { TRPCContext } from "./trpc";
export declare const checkLimitsPublic: (ctx: TRPCContext, type: string, tokens: number, duration: Duration) => Promise<{
    type: "user";
    userId: string;
    anonUser?: undefined;
} | {
    type: "anon";
    anonUser: {
        name: string;
    };
    userId?: undefined;
}>;
export declare const makeReviewer: (db: TRPCContext["db"], data: Awaited<ReturnType<typeof checkLimitsPublic>>, videoId: string) => Promise<{
    id: string;
    userId: string | null;
    videoId: string;
    anonUserId: string | null;
}>;
//# sourceMappingURL=rate-limit.d.ts.map