export declare const limitsRouter: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
    ctx: {
        session: {
            session: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined | undefined;
                userAgent?: string | null | undefined | undefined;
                activeOrganizationId?: string | null | undefined;
            };
            user: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                image?: string | null | undefined | undefined;
                stripeCustomerId?: string | null | undefined;
            };
        } | null;
        db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof import("@acme/db/schema")> & {
            $client: import("drizzle-orm/node-postgres").NodePgClient;
        };
        ip: string;
    };
    meta: object;
    errorShape: {
        data: {
            zodError: import("zod").typeToFlattenedError<any, string> | null;
            code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
            stack?: string;
        };
        message: string;
        code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: true;
}, import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<{
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            uploadLimit: number;
            importLimit: number;
        };
    }>;
}>>;
//# sourceMappingURL=limits.d.ts.map