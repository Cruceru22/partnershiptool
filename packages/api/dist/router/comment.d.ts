export declare const commentRouter: {
    byVideoId: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            videoId: string;
            reviewerId: string | null;
        };
        output: {
            attachments: unknown;
            content: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            metadata: unknown;
            startTime: number | null;
            endTime: number | null;
            videoId: string;
            reviewerId: string | null;
            reviewer: {
                id: string;
                userId: string | null;
                videoId: string;
                anonUserId: string | null;
                user: {
                    name: string;
                    email: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    emailVerified: boolean;
                    image: string | null;
                    stripeCustomerId: string | null;
                } | null;
            } | null;
        }[];
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            content: string;
            id: string;
            startTime: number;
            videoId: string;
            endTime?: number | undefined;
        };
        output: {
            id: string;
        }[];
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: string;
        output: import("pg").QueryResult<never>;
    }>;
};
//# sourceMappingURL=comment.d.ts.map