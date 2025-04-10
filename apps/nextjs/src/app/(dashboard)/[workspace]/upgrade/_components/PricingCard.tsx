import React from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";

import type { Plan } from "@acme/validators/plans";
import { authClient } from "@acme/auth/client";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { toast } from "@acme/ui/toast";

export interface PricingFeature {
  text: string;
}

export interface PricingCardProps {
  title: string;
  price: number;
  plan: Plan;
  features: PricingFeature[];
  popularBadge?: boolean;
  billingCycle: "monthly" | "yearly";
  yearlyDiscountPercentage?: number;
  buttonText?: string;
  additionalContent?: React.ReactNode;
}

export const FeatureItem = ({ text }: { text: string }) => {
  return (
    <li className="flex items-center">
      <div className="mr-2 flex-shrink-0 rounded-full bg-green-100 p-1">
        <Check className="h-4 w-4 text-green-600" />
      </div>
      <span className="text-sm">{text}</span>
    </li>
  );
};

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  plan,
  features,
  popularBadge = false,
  billingCycle = "monthly",
  yearlyDiscountPercentage = 20,
  buttonText,
  additionalContent,
}) => {
  const params = useParams();
  const { data: activeOrg } = authClient.useActiveOrganization();

  // Calculate price with yearly discount if applicable
  const finalPrice =
    billingCycle === "yearly"
      ? Math.round(price * (1 - yearlyDiscountPercentage / 100))
      : price;

  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          {popularBadge && (
            <Badge variant="outline" className="ml-2 bg-muted text-xs">
              Most popular
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">${finalPrice}</span>
            <span className="ml-2 text-sm text-muted-foreground">
              per month, billed {billingCycle}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {additionalContent}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <FeatureItem key={index} text={feature.text} />
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          size="lg"
          className="w-full"
          onClick={async () => {
            if (!activeOrg) {
              toast.error("No active organization found");
              return;
            }

            await authClient.subscription.upgrade({
              plan: plan,
              referenceId: activeOrg.id,
              seats: 1,
              annual: billingCycle === "yearly",
              successUrl: `/${params.workspace as string}`,
              cancelUrl: `/${params.workspace as string}`,
            });
          }}
        >
          {buttonText ?? `Get started with ${title}`}{" "}
          {billingCycle === "yearly" ? "Yearly" : "Monthly"}
        </Button>
      </CardFooter>
    </Card>
  );
};
