import { authRouter } from "./router/auth";
import { awsRouter } from "./router/aws";
import { commentRouter } from "./router/comment";
import { limitsRouter } from "./router/limits";
import { organizationRouter } from "./router/organization";
import { reviewerRouter } from "./router/reviewer";
import { videoRouter } from "./router/video";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  aws: awsRouter,
  video: videoRouter,
  comment: commentRouter,
  limits: limitsRouter,
  reviewer: reviewerRouter,
  organization: organizationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
