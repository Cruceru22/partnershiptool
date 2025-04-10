import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import ffprobePath from "@ffprobe-installer/ffprobe";
import * as Sentry from "@sentry/aws-serverless";
import ffmpeg from "fluent-ffmpeg";

const s3 = new S3({
  useAccelerateEndpoint: true,
});

async function downloadToTemp(bucket: string, key: string): Promise<string> {
  const tempDir = os.tmpdir();
  const tempPath = path.join(
    tempDir,
    `video-${Date.now()}-${path.basename(key)}`,
  );

  const writeStream = fs.createWriteStream(tempPath);

  const response = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  if (!response.Body) {
    throw new Error("Empty response body from S3");
  }

  await new Promise((resolve, reject) => {
    // @ts-ignore: Body type mismatch
    response.Body.pipe(writeStream).on("finish", resolve).on("error", reject);
  });

  return tempPath;
}

async function getVideoInfo(filePath: string): Promise<{ duration: number }> {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(filePath)
      .setFfprobePath(ffprobePath.path)
      .ffprobe((err, data) => {
        if (err) {
          console.error("FFprobe error:", err);
          reject(err);
          return;
        }

        // Try to get duration from format
        let duration = data.format.duration;

        // If format duration is not available, try to get from video stream
        if (!duration || Number.isNaN(duration)) {
          const videoStream = data.streams.find(
            (stream) => stream.codec_type === "video",
          );
          if (videoStream?.duration) {
            duration = parseFloat(videoStream.duration);
          }
        }

        if (!duration || Number.isNaN(duration)) {
          console.error("Invalid duration for file:", filePath);
          console.error("File format:", data.format.format_name);
          reject(new Error(`Invalid duration for file: ${filePath}`));
          return;
        }

        console.log(`Successfully extracted duration: ${duration} seconds`);
        resolve({ duration });
      });
  });
}

const handler = Sentry.wrapHandler(
  async ({ key, bucketName }: { key: string; bucketName: string }) => {
    let tempFilePath: string | null = null;

    try {
      // Download file to temporary location

      tempFilePath = await downloadToTemp(bucketName, key);

      // Process the video
      const info = await getVideoInfo(tempFilePath);

      return info;
    } catch (error) {
      console.error("Error processing video:", error);
      throw error;
    } finally {
      // Clean up temporary file
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
        } catch (cleanupError) {
          console.error("Error cleaning up temporary file:", cleanupError);
          // Don't throw here as the main operation might have succeeded
        }
      }
    }
  },
);

export interface VideoInfo {
  duration: number;
}

export { handler };
