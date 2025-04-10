import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./root";
import { appRouter } from "./root";
import { createTRPCContext } from "./trpc";
/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
declare const createCaller: import("@trpc/server/unstable-core-do-not-import").RouterCaller<{
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
    aws: {
        initiateMultipartUpload: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                videoId: string;
                parts: number;
                contentLength: number;
                fileExtension: string;
            };
            output: {
                uploadId: string;
                signedUrls: {
                    url: string;
                    partNumber: number;
                }[];
            };
        }>;
        completeMultipartUpload: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                videoId: string;
                parts: {
                    PartNumber: number;
                    ETag: string;
                }[];
                fileExtension: string;
                uploadId: string;
            };
            output: {
                success: boolean;
                videoUrl: string;
            };
        }>;
    };
    video: {
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
                id: string;
                title: string;
                description: string | null;
                url: string | null;
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
                id: string;
                title: string;
                description: string | null;
                url: string | null;
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
    comment: {
        byVideoId: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                videoId: string;
                reviewerId: string | null;
            };
            output: {
                id: string;
                createdAt: Date;
                updatedAt: Date | null;
                metadata: unknown;
                content: string | null;
                startTime: number | null;
                endTime: number | null;
                attachments: unknown;
                videoId: string;
                reviewerId: string | null;
                reviewer: {
                    id: string;
                    userId: string | null;
                    videoId: string;
                    anonUserId: string | null;
                    user: {
                        email: string;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        name: string;
                        stripeCustomerId: string | null;
                        emailVerified: boolean;
                        image: string | null;
                    } | null;
                } | null;
            }[];
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                content: string;
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
    limits: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
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
    reviewer: {
        byVideoId: import("@trpc/server").TRPCQueryProcedure<{
            input: string;
            output: {
                id: string;
                userId: string | null;
                videoId: string;
                anonUserId: string | null;
                user: {
                    email: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    stripeCustomerId: string | null;
                    emailVerified: boolean;
                    image: string | null;
                } | null;
            }[];
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
/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;
export { createTRPCContext, appRouter, createCaller };
export type { AppRouter, RouterInputs, RouterOutputs };
//# sourceMappingURL=index.d.ts.map