export declare const videoRouter: {
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            title: string;
        };
        output: {
            id: any;
        }[];
    }>;
    all: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: any;
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
            id: any;
        }[];
    }>;
    byId: import("@trpc/server").TRPCQueryProcedure<{
        input: string;
        output: any;
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