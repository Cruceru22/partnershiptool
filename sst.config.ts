/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "comment-video",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          accessKey: process.env.AWS_ACCESS_KEY,
          secretKey: process.env.AWS_SECRET_KEY,
          region: "eu-central-1",
        },
        "@pulumiverse/vercel": "1.14.3",
      },
    };
  },
  async run() {
    const { bucket } = await import("./infra/bucket");
    const { durationApi, generateThumbnails } = await import("./infra/api");
    return {
      name: bucket.name,
      durationApi: durationApi.name,
      generateThumbnails: generateThumbnails.name,
    };
  },
});
