export declare const postRouter: {
    all: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            title: string;
            content: string;
        }[];
    }>;
    byId: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            title: string;
            content: string;
        } | undefined;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            title: string;
            content: string;
        };
        output: import("pg").QueryResult<never>;
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: string;
        output: import("pg").QueryResult<never>;
    }>;
};
//# sourceMappingURL=post.d.ts.map