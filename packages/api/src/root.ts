import { authRouter } from "./router/auth";
import { blogRouter } from "./router/blog";
import { organizationRouter } from "./router/organization";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  blog: blogRouter,
  organization: organizationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
