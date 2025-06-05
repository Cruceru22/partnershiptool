export declare const appRouter: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
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
    auth: {
        getSession: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
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
        }>;
        getSecretMessage: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: string;
        }>;
    };
    blog: {
        getAll: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                images: string[] | null;
                authorId: string;
                published: boolean;
                author: {
                    id: string;
                    name: string;
                    image: string | null;
                };
            }[];
        }>;
        debug: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                images: string[] | null;
                authorId: string;
                published: boolean;
                author: {
                    id: string;
                    name: string;
                    image: string | null;
                };
            }[];
        }>;
        getAllForNick: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                images: string[] | null;
                authorId: string;
                published: boolean;
                author: {
                    id: string;
                    name: string;
                    image: string | null;
                };
            }[];
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                title: string;
                content: string;
                images?: string[] | undefined;
                published?: boolean | undefined;
            };
            output: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                images: string[] | null;
                authorId: string;
                published: boolean;
            } | undefined;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                title?: string | undefined;
                content?: string | undefined;
                images?: string[] | undefined;
                published?: boolean | undefined;
            };
            output: {
                id: string;
                title: string;
                content: string;
                images: string[] | null;
                authorId: string;
                createdAt: Date;
                updatedAt: Date;
                published: boolean;
            } | undefined;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                success: boolean;
            };
        }>;
        isNick: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                isNick: boolean;
            };
        }>;
    };
    organization: {
        subscription: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                status: string | null;
                referenceId: string;
                id: string;
                plan: string;
                stripeCustomerId: string | null;
                stripeSubscriptionId: string | null;
                periodStart: Date | null;
                periodEnd: Date | null;
                cancelAtPeriodEnd: boolean | null;
                seats: number | null;
            } | null;
        }>;
        inviteMember: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                role?: "member" | "admin" | "guest" | undefined;
            };
            output: {
                success: boolean;
                email: string;
                message: string;
            };
        }>;
    };
}>>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=root.d.ts.map