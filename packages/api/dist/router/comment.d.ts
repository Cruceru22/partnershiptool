export declare const commentRouter: {
    byVideoId: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            videoId: string;
            reviewerId: string | null;
        };
        output: any;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            videoId: string;
            content: string;
            startTime: number;
            endTime?: number | undefined;
        };
        output: (import("drizzle-orm/node-postgres").NodePgDatabase<typeof import("@acme/db/schema")> & {
            $client: import("drizzle-orm/node-postgres").NodePgClient;
        }) | {
            id: any;
        }[];
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: string;
        output: import("pg").QueryResult<never>;
    }>;
};
//# sourceMappingURL=comment.d.ts.map