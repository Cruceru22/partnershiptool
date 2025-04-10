export const bucket = new sst.aws.Bucket("MyBucket", {
  access: "cloudfront",
  cors: {
    allowHeaders: ["*"],
    allowOrigins: ["*"],
    allowMethods: ["DELETE", "GET", "HEAD", "POST", "PUT"],
    exposeHeaders: [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "ETag",
    ],
    maxAge: "0 seconds",
  },
});

export const bucketAccelerationConfig =
  new aws.s3.BucketAccelerateConfigurationV2("MyBucketAccelerationConfig", {
    bucket: bucket.name,
    status: "Enabled",
  });

export const responseHeadersPolicy = new aws.cloudfront.ResponseHeadersPolicy(
  "MyBucketPolicy",
  {
    name: "VideoResponsePolicy",
    corsConfig: {
      accessControlAllowCredentials: false,
      accessControlAllowHeaders: {
        items: ["*"],
      },
      accessControlAllowMethods: {
        items: ["DELETE", "GET", "HEAD", "POST", "PUT"],
      },
      accessControlAllowOrigins: {
        items: ["*"],
      },
      accessControlMaxAgeSec: 600,
      originOverride: true,
    },
    customHeadersConfig: {
      items: [
        {
          header: "Cache-Control",
          override: true,
          value:
            "public, max-age=604800, immutable, stale-while-revalidate=86400",
        },
      ],
    },
  },
);

export const cloudfront =
  $app.stage !== "production"
    ? null
    : new sst.aws.Router("MyRouter", {
        transform: {
          cdn: ({ defaultCacheBehavior, ...rest }) => {
            defaultCacheBehavior = {
              ...defaultCacheBehavior,
              responseHeadersPolicyId: responseHeadersPolicy.id,
            };
          },
        },
        domain: {
          name: "infra.comment.video",
          dns: sst.vercel.dns({
            domain: "comment.video",
            transform: {
              record(r) {
                if (r.type === "CAA") {
                  r.name = "";
                  r.value = r.value.toString().replace("issue", "issuewild");
                }
              },
            },
          }),
        },
        routes: {
          "/video/*": {
            rewrite: {
              regex: "^/video/(.*)$",
              to: "/$1",
            },
            bucket: bucket,
          },
        },
      });
