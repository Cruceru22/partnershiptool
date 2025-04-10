import * as os from "os";
import * as path from "path";
import type { S3Event } from "aws-lambda";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs-extra";
import { Resource } from "sst";

const s3Client = new S3Client({
  useAccelerateEndpoint: true,
});
const THUMBNAIL_INTERVAL = 1; // Generate a thumbnail every 10 seconds
const THUMBNAIL_WIDTH = 320; // Width of thumbnails
const THUMBNAIL_HEIGHT = 180; // Height of thumbnails (16:9 aspect ratio)

interface ThumbnailInfo {
  filename: string;
  timestamp: number;
  path: string;
}

const MAX_PARALLEL_THUMBNAILS = 5;

const getVideoDuration = async (key: string) => {
  const client = new LambdaClient();

  const res = await client.send(
    new InvokeCommand({
      FunctionName: Resource.Duration.name,
      Payload: JSON.stringify({ key, bucketName: Resource.MyBucket.name }),
    }),
  );
  if (!res.Payload) {
    throw new Error("Lambda returned empty payload");
  }
  if (res.FunctionError) {
    throw new Error(
      `Lambda execution failed: ${Buffer.from(res.Payload).toString()}`,
    );
  }

  const payload = JSON.parse(Buffer.from(res.Payload).toString()) as {
    duration: number;
  };

  return payload.duration;
};

export const handler = async (event: S3Event) => {
  try {
    // Get the S3 bucket and key from the event
    const record = event.Records[0]; // Process the first record
    const bucket = record?.s3.bucket.name;

    if (!bucket) {
      throw new Error("Bucket is undefined");
    }

    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    if (!key) {
      throw new Error("Key is undefined");
    }

    // Only process video files
    if (!/\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i.exec(key)) {
      console.log(`Skipping non-video file: ${key}`);
      return;
    }

    // Extract video ID from the key (assuming the key is the video ID)
    const videoId = key.split("/")[0]!;

    console.log(`Processing video: ${videoId} from bucket: ${bucket}`);

    // Create temp directory for processing
    const tempDir = path.join(os.tmpdir(), videoId);
    await fs.ensureDir(tempDir);

    try {
      // Download the video file from S3
      const videoPath = path.join(tempDir, `${videoId}`);
      await downloadFromS3(bucket, key, videoPath);

      // Generate thumbnails and get metadata
      const { duration, thumbnails } = await generateVideoThumbnails(
        videoPath,
        tempDir,
        videoId,
        key,
      );

      // Generate WebVTT file
      const vttPath = path.join(tempDir, `root.vtt`);
      await generateVTTFile(vttPath, thumbnails, duration, videoId);

      // Upload thumbnails to S3
      for (const thumbnail of thumbnails) {
        const thumbnailPath = path.join(tempDir, thumbnail.filename);
        await uploadToS3(
          bucket,
          `${videoId}/thumbnails/${thumbnail.filename}`,
          thumbnailPath,
          "image/jpeg",
        );
      }

      // Upload VTT file to S3
      await uploadToS3(
        bucket,
        `${videoId}/thumbnails/root.vtt`,
        vttPath,
        "text/vtt",
      );

      console.log(
        `Successfully processed video ${videoId}, generated ${thumbnails.length} thumbnails and VTT file`,
      );
    } finally {
      // Clean up temporary directory
      await fs.remove(tempDir);
    }
  } catch (error) {
    console.error("Error processing video:", error);
    throw error;
  }
};

/**
 * Download a file from S3 to local path
 */
async function downloadFromS3(
  bucket: string,
  key: string,
  localPath: string,
): Promise<void> {
  console.log(`Downloading s3://${bucket}/${key} to ${localPath}`);

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await s3Client.send(command);

  if (!response.Body) {
    throw new Error(`Failed to download file from S3: ${key}`);
  }

  // Convert readable stream to buffer
  const chunks: Uint8Array[] = [];
  for await (const chunk of response.Body as any) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  // Write buffer to file
  await fs.writeFile(localPath, buffer);
  console.log(`Downloaded file successfully to ${localPath}`);
}

/**
 * Upload a file from local path to S3
 */
async function uploadToS3(
  bucket: string,
  key: string,
  localPath: string,
  contentType: string,
): Promise<void> {
  console.log(`Uploading ${localPath} to s3://${bucket}/${key}`);

  const fileContent = await fs.readFile(localPath);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  });

  await s3Client.send(command);
  console.log(`Uploaded file successfully to s3://${bucket}/${key}`);
}

/**
 * Generate thumbnails for a video using ffmpeg
 */
async function generateVideoThumbnails(
  videoPath: string,
  outputDir: string,
  videoId: string,
  key: string,
): Promise<{
  duration: number;
  thumbnails: ThumbnailInfo[];
}> {
  try {
    // Use getVideoDuration instead of ffprobe
    const videoDuration = await getVideoDuration(key);

    if (videoDuration <= 0) {
      throw new Error("Could not determine video duration");
    }

    console.log(`Video duration: ${videoDuration} seconds`);

    // Calculate timestamps for thumbnails at defined intervals
    const timestamps: number[] = [];
    for (let time = 0; time < videoDuration; time += THUMBNAIL_INTERVAL) {
      timestamps.push(time);
    }

    // Ensure we have at least one thumbnail if the video is very short
    if (timestamps.length === 0) {
      timestamps.push(0);
    }

    const thumbnails: ThumbnailInfo[] = [];

    // Process thumbnails in batches
    for (let i = 0; i < timestamps.length; i += MAX_PARALLEL_THUMBNAILS) {
      const batchTimestamps = timestamps.slice(i, i + MAX_PARALLEL_THUMBNAILS);
      console.log(
        `Processing thumbnail batch ${Math.floor(i / MAX_PARALLEL_THUMBNAILS) + 1}, timestamps: ${batchTimestamps.join(", ")}s`,
      );

      const batchPromises = batchTimestamps.map((timestamp, index) =>
        generateSingleThumbnail(
          videoPath,
          outputDir,
          videoId,
          timestamp,
          i + index,
        ),
      );

      const batchResults = await Promise.all(batchPromises);
      thumbnails.push(...batchResults);
    }

    // Sort thumbnails by timestamp
    thumbnails.sort((a, b) => a.timestamp - b.timestamp);

    return {
      duration: videoDuration,
      thumbnails,
    };
  } catch (err) {
    throw err;
  }
}

/**
 * Generate a WebVTT file for the thumbnails
 */
async function generateVTTFile(
  vttPath: string,
  thumbnails: ThumbnailInfo[],
  duration: number,
  videoId: string,
): Promise<void> {
  let vttContent = `WEBVTT\n\n`;

  thumbnails.forEach((thumbnail, index) => {
    const startTime = formatVttTime(thumbnail.timestamp);
    // End time is either the start of the next thumbnail or the end of the video
    const endTime =
      index < thumbnails.length - 1
        ? formatVttTime(thumbnails[index + 1]?.timestamp || duration)
        : formatVttTime(duration);

    vttContent += `${startTime} --> ${endTime}\n`;
    vttContent += `/video/${videoId}/thumbnails/${path.basename(thumbnail.filename)}\n\n`;
  });

  await fs.writeFile(vttPath, vttContent);
  console.log(`Generated VTT file at ${vttPath}`);
}

/**
 * Format a timestamp in seconds to WebVTT format (HH:MM:SS.mmm)
 */
function formatVttTime(seconds: number): string {
  const date = new Date(seconds * 1000);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const secs = date.getUTCSeconds().toString().padStart(2, "0");
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, "0");

  return `${hours}:${minutes}:${secs}.${milliseconds}`;
}

export async function generateThumbnailsInBatches(
  videoPath: string,
  outputDir: string,
  videoId: string,
  interval = 5, // Generate a thumbnail every 5 seconds
): Promise<ThumbnailInfo[]> {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get video duration
  const duration = await getVideoDuration(videoPath);
  console.log(`Video duration: ${duration} seconds`);

  // Calculate timestamps for thumbnails
  const timestamps: number[] = [];
  for (let time = 0; time < duration; time += interval) {
    timestamps.push(time);
  }

  // Ensure we have at least one thumbnail if the video is very short
  if (timestamps.length === 0) {
    timestamps.push(0);
  }

  const allThumbnails: ThumbnailInfo[] = [];

  // Process thumbnails in batches
  for (let i = 0; i < timestamps.length; i += MAX_PARALLEL_THUMBNAILS) {
    const batchTimestamps = timestamps.slice(i, i + MAX_PARALLEL_THUMBNAILS);
    console.log(
      `Processing thumbnail batch ${i / MAX_PARALLEL_THUMBNAILS + 1}, timestamps: ${batchTimestamps.join(", ")}s`,
    );

    const batchPromises = batchTimestamps.map((timestamp, index) =>
      generateSingleThumbnail(
        videoPath,
        outputDir,
        videoId,
        timestamp,
        i + index,
      ),
    );

    const batchResults = await Promise.all(batchPromises);
    allThumbnails.push(...batchResults);
  }

  return allThumbnails;
}

async function generateSingleThumbnail(
  videoPath: string,
  outputDir: string,
  videoId: string,
  timestamp: number,
  index: number,
): Promise<ThumbnailInfo> {
  const outputFilename = `${index}.jpg`;
  const outputPath = path.join(outputDir, outputFilename);

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .setFfmpegPath(ffmpegPath!)
      .screenshots({
        timestamps: [timestamp],
        filename: outputFilename,
        folder: outputDir,
        size: `${THUMBNAIL_WIDTH}x${THUMBNAIL_HEIGHT}`,
      })
      .on("end", () => {
        console.log(
          `Generated thumbnail ${outputFilename} at ${timestamp} seconds`,
        );
        resolve({
          filename: outputFilename,
          timestamp: timestamp,
          path: outputPath,
        });
      })
      .on("error", (err: Error) => {
        reject(err);
      });
  });
}
