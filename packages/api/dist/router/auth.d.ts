export declare const authRouter: {
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
//# sourceMappingURL=auth.d.ts.map