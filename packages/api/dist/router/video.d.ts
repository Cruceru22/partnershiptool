export declare const videoRouter: {
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            title: string;
        };
        output: {
            id: string;
        }[];
    }>;
    all: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            url: string | null;
            id: string;
            title: string;
            description: string | null;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date | null;
        }[];
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: string;
        output: import("pg").QueryResult<never>;
    }>;
    rename: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            title: string;
        };
        output: {
            id: string;
        }[];
    }>;
    byId: import("@trpc/server").TRPCQueryProcedure<{
        input: string;
        output: {
            url: string | null;
            id: string;
            title: string;
            description: string | null;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date | null;
        } | undefined;
    }>;
    thumbnailCheck: import("@trpc/server").TRPCMutationProcedure<{
        input: string;
        output: {
            success: boolean;
            key: string;
            response: {};
        };
    }>;
};
//# sourceMappingURL=video.d.ts.map