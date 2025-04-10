import { bucket } from "./bucket";

export const durationApi = new sst.aws.Function("Duration", {
  memory: "2 GB",
  timeout: "15 minutes",
  handler: "packages/aws-functions/src/duration.aws.handler",
  link: [bucket],
  nodejs: {
    sourcemap: true,
    install: [
      "@ffprobe-installer/ffprobe",
      "@sentry/aws-serverless",
      "@sentry/profiling-node",
    ],
  },
  environment: {
    NODE_OPTIONS: "--import @sentry/aws-serverless/awslambda-auto",
    // SENTRY_DSN:
    //   "https://893e8515e4c17accb96fec22f2aee0e1@o4505716023164928.ingest.us.sentry.io/4508307207749632",
    SENTRY_TRACES_SAMPLE_RATE: "1.0",
  },
});

export const generateThumbnails = new sst.aws.Function("GenerateThumbnails", {
  memory: "3008 MB",
  timeout: "15 minutes",
  handler: "packages/aws-functions/src/generate-thumbnails.aws.handler",
  nodejs: {
    sourcemap: true,
    install: [
      "ffmpeg-static",
      "@sentry/aws-serverless",
      "@sentry/profiling-node",
    ],
  },
  environment: {
    NODE_OPTIONS: "--import @sentry/aws-serverless/awslambda-auto",
    // SENTRY_DSN:
    //   "https://893e8515e4c17accb96fec22f2aee0e1@o4505716023164928.ingest.us.sentry.io/4508307207749632",
    SENTRY_TRACES_SAMPLE_RATE: "1.0",
  },
  link: [bucket, durationApi],
});

bucket.notify({
  notifications: [
    {
      name: "GenerateThumbnails",
      function: generateThumbnails.arn,
      events: ["s3:ObjectCreated:CompleteMultipartUpload"],
    },
  ],
});
