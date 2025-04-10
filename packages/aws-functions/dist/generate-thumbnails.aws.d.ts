import type { S3Event } from "aws-lambda";
interface ThumbnailInfo {
    filename: string;
    timestamp: number;
    path: string;
}
export declare const handler: (event: S3Event) => Promise<void>;
export declare function generateThumbnailsInBatches(videoPath: string, outputDir: string, videoId: string, interval?: number): Promise<ThumbnailInfo[]>;
export {};
//# sourceMappingURL=generate-thumbnails.aws.d.ts.map