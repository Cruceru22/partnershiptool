"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Progress } from "@acme/ui/progress";
import { useSidebar } from "@acme/ui/sidebar";
import { getImportLimit, getUploadSizeLimit } from "@acme/validators/limits";

import { useOrganizationPlan } from "~/hooks/useOrganizationPlan";
import { useTRPC } from "~/trpc/react";

interface UsageItemProps {
  label: string;
  value: number;
  max: number;
  suffix?: string;
}

export const UsageItem = ({ label, value, max, suffix }: UsageItemProps) => {
  return (
    <div className="flex flex-col items-start justify-between gap-0.5">
      <p className="flex w-full items-center gap-2">
        <span className="text-sm text-foreground">{label}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {value}/{max}
          {suffix && (
            <span className="text-xs text-muted-foreground">{suffix}</span>
          )}
        </span>
      </p>
      <Progress value={Math.min((value / max) * 100, 100)} max={100} />
    </div>
  );
};

export default function UsageInfo() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const params = useParams();

  const trpc = useTRPC();
  const { data: limits } = useQuery(trpc.limits.get.queryOptions());

  const plan = useOrganizationPlan();

  if (isCollapsed) return null;

  return (
    <div className="flex flex-col gap-2 rounded-md border p-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <p className="text-sm font-semibold text-foreground">Usage</p>
          <Badge variant="outline">Free</Badge>
        </div>
        <UsageItem
          label="Storage used"
          value={limits?.uploadLimit ?? 0}
          max={getUploadSizeLimit(plan)}
          suffix="MB"
        />
        <UsageItem
          label="Uploads used"
          value={limits?.importLimit ?? 0}
          max={getImportLimit(plan)}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Usage will reset Apr 8, 2025
      </p>

      <Link href={`/${params.workspace as string}/upgrade`}>
        <Button variant="primary" className="w-full">
          Get Pro Version
        </Button>
      </Link>
    </div>
  );
}
