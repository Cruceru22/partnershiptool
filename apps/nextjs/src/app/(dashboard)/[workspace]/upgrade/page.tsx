"use client";

import React, { useState } from "react";

import { Badge } from "@acme/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@acme/ui/tabs";

import type { PricingFeature } from "./_components/PricingCard";
import ExitButton from "./_components/exit-button";
import { PricingCard } from "./_components/PricingCard";

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly",
  );

  // Define features for Pro plan
  const proFeatures: PricingFeature[] = [
    { text: "50K tracked clicks/mo" },
    { text: "1,000 new links/mo" },
    { text: "1-year analytics retention" },
    { text: "10 domains" },
    { text: "5 users" },
    { text: "Advanced link features" },
    { text: "Unlimited AI credits" },
    { text: "Priority support" },
    { text: "Premium dub.link domain" },
    { text: "Free custom domain" },
  ];

  // Define features for Business plan
  const businessFeatures: PricingFeature[] = [
    { text: "150K tracked clicks/mo" },
    { text: "5,000 new links/mo" },
    { text: "$5,000 tracked sales/mo" },
    { text: "3-year analytics retention" },
    { text: "40 domains" },
    { text: "15 users" },
    { text: "Real-time events stream" },
    { text: "Real-time webhooks" },
  ];

  // Business plan tabs component
  const businessAdditionalContent = (
    <>
      <div className="mb-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="plus">Plus</TabsTrigger>
            <TabsTrigger value="extra">Extra</TabsTrigger>
            <TabsTrigger value="max">Max</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Everything in Pro, plus:
      </p>
    </>
  );

  return (
    <div className="fixed inset-0 z-10 h-full w-full bg-background px-4 py-12">
      <ExitButton />
      <div className="mb-12 flex flex-col items-center justify-center">
        <h1 className="mb-2 text-center text-4xl font-bold tracking-tight">
          Choose your plan
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          Find a plan that fits your needs
        </p>

        <div className="mt-8">
          <Tabs
            defaultValue="yearly"
            onValueChange={(value) =>
              setBillingCycle(value as "monthly" | "yearly")
            }
          >
            <TabsList className="grid w-[250px] grid-cols-2">
              <TabsTrigger value="monthly">Pay Monthly</TabsTrigger>
              <TabsTrigger value="yearly" className="relative">
                Pay Yearly
                <Badge className="absolute -right-8 -top-2 bg-blue-500 px-2 py-0.5 text-xs text-white">
                  Save 20%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Pro Plan */}
        <PricingCard
          plan="pro"
          title="Pro"
          price={19}
          features={proFeatures}
          popularBadge={true}
          billingCycle={billingCycle}
          yearlyDiscountPercentage={20}
        />

        {/* Business Plan */}
        <PricingCard
          plan="team"
          title="Business"
          price={49}
          features={businessFeatures}
          billingCycle={billingCycle}
          yearlyDiscountPercentage={20}
          additionalContent={businessAdditionalContent}
        />
      </div>

      <div className="mt-16 text-center">
        <a href="#" className="text-primary hover:underline">
          Looking for enterprise?
        </a>
      </div>
    </div>
  );
};

export default PricingPage;
