import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { stripe } from "@better-auth/stripe";
import slugify from "@sindresorhus/slugify";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, oAuthProxy, organization } from "better-auth/plugins";
import { nanoid } from "nanoid";
import { Resend } from "resend";
import Stripe from "stripe";

import { db } from "@acme/db/client";
import { eq, and, gt, sql } from "@acme/db";

import { env } from "../env";

const resend = new Resend(env.RESEND_API_KEY);

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY);

export const config = {
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secret: env.AUTH_SECRET,
  plugins: [
    oAuthProxy(),
    expo(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Always log the OTP to the console for testing
        console.log(`Sending ${type} OTP to ${email}: ${otp}`);

        try {
          // In test mode, Resend only allows sending to the verified email
          const verifiedEmail = email;

          // Send the email using Resend to the verified email, but include the intended recipient in the subject
          const { data, error } = await resend.emails.send({
            from: "auth@email.comment.video",
            to: verifiedEmail,
            subject: `${getSubject(type)} [For: ${email}]`, // Include the intended recipient in the subject
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${getSubject(type)}</title>
                <style>
                  body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                  }
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                    text-align: center;
                    padding: 20px 0;
                    border-bottom: 1px solid #eaeaea;
                  }
                  .logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #4f46e5;
                  }
                  .content {
                    padding: 30px 20px;
                    text-align: center;
                  }
                  .code {
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    padding: 15px;
                    margin: 25px 0;
                    background-color: #f3f4f6;
                    border-radius: 6px;
                    display: inline-block;
                  }
                  .footer {
                    text-align: center;
                    padding: 20px 0;
                    color: #6b7280;
                    font-size: 14px;
                    border-top: 1px solid #eaeaea;
                  }
                  .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #4f46e5;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: 600;
                    margin-top: 20px;
                  }
                  .note {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #6b7280;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <div class="logo">comment.video</div>
                  </div>
                  <div class="content">
                    <div style="background-color: #ffe8e8; padding: 10px; margin-bottom: 20px; border-radius: 4px; text-align: left;">
                      <strong>Development Mode Notice:</strong> This email was intended for <strong>${email}</strong> but was sent to you because of Resend's test mode limitations.
                    </div>
                    <h2>${getEmailHeading(type)}</h2>
                    <p>${getEmailMessage(type)}</p>
                    <div class="code">${otp}</div>
                    <p>This code will expire in 5 minutes.</p>
                    <p class="note">If you didn't request this code, you can safely ignore this email.</p>
                  </div>
                  <div class="footer">
                    &copy; ${new Date().getFullYear()} comment.video. All rights reserved.
                  </div>
                </div>
              </body>
              </html>
            `,
          });

          if (error) {
            console.error("Resend API Error:", error);
          } else {
            console.log("Email sent successfully:", data);
          }
        } catch (error) {
          console.error("Error sending email:", error);
          // Still allow the OTP to be generated even if email sending fails
        }
      },
      // Set OTP length to 6 digits
      otpLength: 6,
      // OTP expires in 5 minutes (300 seconds)
      expiresIn: 300,
      // Allow automatic sign-up when the user is not registered
      disableSignUp: false,
    }),
    organization(),
    stripe({
      stripeClient,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET ?? "",
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        authorizeReference: async ({ user, referenceId }) => {
          const member = await db.query.member.findFirst({
            where: (member, { eq, and }) =>
              and(
                eq(member.userId, user.id),
                eq(member.organizationId, referenceId),
              ),
          });

          return member?.role === "owner" || member?.role === "admin";
        },
        plans: [
          {
            name: "pro", // the name of the plan, it'll be automatically lower cased when stored in the database
            lookupKey: "pro_monthly",
            priceId: "price_1R1Dj0EauNpNklnFp7YC2iSW",
            annualDiscountPriceId: "price_1R1QYaEauNpNklnF5y6CwgFt",
            //TODO handle limits from stripe for each plan, sounds better
          },
          {
            name: "team",
            lookupKey: "team_monthly",
            priceId: "price_1R1Dk1EauNpNklnFZcleYNzg",
            annualDiscountPriceId: "price_1R1QZKEauNpNklnFdSILW732",
            //TODO handle limits from stripe for each plan, sounds better
          },
          {
            name: "friend",
            lookupKey: "friend_monthly",
            priceId: "price_1R1Dk1EauNpNklnFZcleYNzg",
          },
        ],
      },
    }),
  ],
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  trustedOrigins: ["exp://"],

  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const member = await db.query.member.findFirst({
            where: (org, { eq }) => eq(org.userId, session.userId),
          });
          return {
            data: {
              ...session,
              activeOrganizationId: member?.organizationId,
            },
          };
        },
      },
      update: {
        before: async (session, context) => {
          // Ensure required session fields are present
          if (!session.id || !session.userId || !session.expiresAt || !session.token) {
            return false;
          }

          if (!context || typeof context !== 'object') {
            return {
              data: {
                id: session.id,
                userId: session.userId,
                expiresAt: session.expiresAt,
                token: session.token,
                createdAt: session.createdAt || new Date(),
                updatedAt: new Date(),
                ipAddress: session.ipAddress || null,
                userAgent: session.userAgent || null,
                activeOrganizationId: null,
              },
            };
          }

          const updateData = context as { data?: { activeOrganizationId?: string } };
          const newOrgId = updateData?.data?.activeOrganizationId;
          
          // If activeOrganizationId is being updated, verify the user is a member
          if (newOrgId) {
            const member = await db.query.member.findFirst({
              where: (org, { eq, and }) =>
                and(
                  eq(org.userId, sql`${session.userId}`),
                  eq(org.organizationId, sql`${newOrgId}`),
                ),
            });

            if (!member) {
              throw new Error("User is not a member of this organization");
            }

            // Return the session with the new activeOrganizationId
            return {
              data: {
                id: session.id,
                userId: session.userId,
                expiresAt: session.expiresAt,
                token: session.token,
                createdAt: session.createdAt || new Date(),
                updatedAt: new Date(),
                ipAddress: session.ipAddress || null,
                userAgent: session.userAgent || null,
                activeOrganizationId: newOrgId,
              },
            };
          }

          // If no activeOrganizationId update, return the original session
          return {
            data: {
              id: session.id,
              userId: session.userId,
              expiresAt: session.expiresAt,
              token: session.token,
              createdAt: session.createdAt || new Date(),
              updatedAt: new Date(),
              ipAddress: session.ipAddress || null,
              userAgent: session.userAgent || null,
              activeOrganizationId: null,
            },
          };
        },
      },
    },
  },
} satisfies BetterAuthOptions;

// Helper function to get the subject line based on the OTP type
function getSubject(type: string): string {
  switch (type) {
    case "sign-in":
      return "Your Sign In Code for comment.video";
    case "email-verification":
      return "Verify Your Email Address for comment.video";
    case "forget-password":
      return "Reset Your Password for comment.video";
    default:
      return "Your Verification Code for comment.video";
  }
}

// Helper function to get the email heading based on the OTP type
function getEmailHeading(type: string): string {
  switch (type) {
    case "sign-in":
      return "Sign In to Your Account";
    case "email-verification":
      return "Verify Your Email Address";
    case "forget-password":
      return "Reset Your Password";
    default:
      return "Your Verification Code";
  }
}

// Helper function to get the email message based on the OTP type
function getEmailMessage(type: string): string {
  switch (type) {
    case "sign-in":
      return "Use the following code to sign in to your account:";
    case "email-verification":
      return "To verify your email address, please enter the following code:";
    case "forget-password":
      return "To reset your password, please enter the following code:";
    default:
      return "Your verification code is:";
  }
}

export const auth = betterAuth(config);
export type Session = typeof auth.$Infer.Session;
