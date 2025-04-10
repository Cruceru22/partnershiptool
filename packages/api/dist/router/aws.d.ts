export declare const awsRouter: {
    initiateMultipartUpload: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            videoId: string;
            parts: number;
            contentLength: number;
            fileExtension: string;
        };
        output: {
            uploadId: string;
            signedUrls: {
                url: string;
                partNumber: number;
            }[];
        };
    }>;
    completeMultipartUpload: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            videoId: string;
            parts: {
                PartNumber: number;
                ETag: string;
            }[];
            fileExtension: string;
            uploadId: string;
        };
        output: {
            success: boolean;
            videoUrl: string;
        };
    }>;
};
//# sourceMappingURL=aws.d.ts.map