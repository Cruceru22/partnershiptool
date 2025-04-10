import type { Plan } from "./plans";
export declare const checkUploadLimit: (plan: Plan, organizationId: string, sizeInMB: number) => Promise<boolean>;
export declare const generateAnonUser: (ip: string) => Promise<string>;
export declare const getAnonUser: (ip: string) => Promise<{
    name: string;
}>;
//# sourceMappingURL=redis.d.ts.map