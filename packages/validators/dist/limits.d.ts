type Plan = "free" | "pro" | "team";
export declare const getUploadSizeLimit: (plan: Plan) => number;
export declare const getImportLimit: (plan: Plan) => number;
export declare const getUploadSizeLimitKey: (userId: string) => string;
export declare const getImportLimitKey: (userId: string) => string;
export declare const getEndOfMonthDuration: () => number;
export declare const getEndOfDayDuration: () => number;
export {};
//# sourceMappingURL=limits.d.ts.map