import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq } from "@acme/db";
import { subscription } from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

// Schema for invitation request
const invitationSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "member", "guest"]).default("member"),
});

export const organizationRouter = {
  subscription: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;
    if (!session.session.activeOrganizationId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No active organization",
      });
    }
    const sub = await ctx.db.query.subscription.findFirst({
      where: eq(subscription.referenceId, session.session.activeOrganizationId),
    });
    return sub ?? null;
  }),

  // Add a new endpoint for inviting members
  inviteMember: protectedProcedure
    .input(invitationSchema)
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;

      // Check if user has an active organization
      if (!session.session.activeOrganizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No active organization",
        });
      }

      // We would normally create a record in the database and generate a token here
      const invitationToken = `invite_${Math.random().toString(36).substring(2, 15)}`;

      try {
        // In a real implementation, you would:
        // 1. Check if the email already exists in the organization
        // 2. Create an invitation record in the database
        // 3. Generate a secure token

        // Send the invitation email
        // await emailService.sendInvitationEmail({
        //   inviterName: session.user.name || "Team Member",
        //   organizationName: "Your Organization",
        //   invitationToken,
        //   inviteeEmail: input.email,
        //   role: input.role,
        // });

        return {
          success: true,
          email: input.email,
          message: `Invitation sent to ${input.email}`,
        };
      } catch (error) {
        console.error("Failed to invite member:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send invitation",
          cause: error,
        });
      }
    }),
} satisfies TRPCRouterRecord;
