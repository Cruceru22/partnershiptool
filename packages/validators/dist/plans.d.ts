export declare const plans: readonly [{
    readonly name: "pro";
    readonly lookupKey: "pro_monthly";
}, {
    readonly name: "team";
    readonly lookupKey: "team_monthly";
}];
export type Plan = (typeof plans)[number]["name"];
//# sourceMappingURL=plans.d.ts.map