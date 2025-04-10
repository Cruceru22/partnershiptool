export declare const reviewerRouter: {
    byVideoId: import("@trpc/server").TRPCQueryProcedure<{
        input: string;
        output: {
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
        }[];
    }>;
};
//# sourceMappingURL=reviewer.d.ts.map