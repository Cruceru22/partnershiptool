declare const handler: import("aws-lambda").Handler<{
    key: string;
    bucketName: string;
}, {
    duration: number;
}>;
export interface VideoInfo {
    duration: number;
}
export { handler };
//# sourceMappingURL=duration.aws.d.ts.map