import { stripeClient } from "@better-auth/stripe/client";
import { emailOTPClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
    organizationClient(),
    stripeClient({
      subscription: true, //if you want to enable subscription management
    }),
  ],
});
