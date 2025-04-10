export declare const organizationRouter: {
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
//# sourceMappingURL=organization.d.ts.map