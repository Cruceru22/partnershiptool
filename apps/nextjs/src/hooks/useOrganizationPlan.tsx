import { useQuery } from "@tanstack/react-query";

import type { Plan } from "@acme/validators/plans";

import { useTRPC } from "~/trpc/react";

export const useOrganizationPlan = () => {
  const trpc = useTRPC();
  const { data: subscription } = useQuery(
    trpc.organization.subscription.queryOptions(),
  );

  return (subscription?.plan ?? "free") as Plan;
};
