"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "lucide-react";
import Confetti from "react-dom-confetti";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@acme/ui/accordion";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Switch } from "@acme/ui/switch";
import { toast } from "sonner";

interface Feature {
  name: string;
  value: string | boolean | number;
  tooltip?: string;
}

interface PricingTier {
  name: string;
  monthlyPrice: number | string;
  annualPrice: number | string;
  discount: number | null;
  features: Feature[];
  isPopular?: boolean;
  buttonText?: string;
}

export default function PricingClientPage() {
  const [discount, setDiscount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeButtonId, setActiveButtonId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [needsOrganization, setNeedsOrganization] = useState(false);
  const [isCheckingOrgs, setIsCheckingOrgs] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      monthlyPrice: 75,
      annualPrice: 810,
      discount: 10,
      features: [
        { name: "Included Advertisers", value: "3" },
        { name: "Additional Advertiser Fee", value: "$15 each" },
        { name: "Included Users", value: "2" },
        { name: "Additional User Fee", value: "$10 each" },
        { name: "AI Insights & Benchmarks", value: "Add-on $15" },
        { name: "Aggregated Multi-Network Hub", value: true },
        { name: "Core Reporting & Dashboards", value: true },
        { name: "Unified Application Management", value: true },
        { name: "Partner-Level Aggregation", value: true },
        { name: "Custom Date Ranges / Exports", value: true },
        { name: "Weekly Advertiser Summary", value: true },
        { name: "Automation & Alert Rules", value: "Basic" },
        { name: "Quarterly AI Audits", value: "—" },
        { name: "White-Label PDFs", value: "—" },
        { name: "Dedicated Customer Success Manager", value: "—" },
        { name: "Onboarding & Data Migration", value: "Self-serve" }
      ]
    },
    {
      name: "Growth",
      monthlyPrice: 95,
      annualPrice: 1003,
      discount: 12,
      features: [
        { name: "Included Advertisers", value: "5" },
        { name: "Additional Advertiser Fee", value: "$15 each" },
        { name: "Included Users", value: "3" },
        { name: "Additional User Fee", value: "$10 each" },
        { name: "AI Insights & Benchmarks", value: "Included" },
        { name: "Aggregated Multi-Network Hub", value: true },
        { name: "Core Reporting & Dashboards", value: true },
        { name: "Unified Application Management", value: true },
        { name: "Partner-Level Aggregation", value: true },
        { name: "Custom Date Ranges / Exports", value: true },
        { name: "Weekly Advertiser Summary", value: true },
        { name: "Automation & Alert Rules", value: "Standard" },
        { name: "Quarterly AI Audits", value: "1 per Qtr" },
        { name: "White-Label PDFs", value: "—" },
        { name: "Dedicated Customer Success Manager", value: "—" },
        { name: "Onboarding & Data Migration", value: "Guided" }
      ],
      isPopular: true
    },
    {
      name: "Scale",
      monthlyPrice: 140,
      annualPrice: 1428,
      discount: 15,
      features: [
        { name: "Included Advertisers", value: "10" },
        { name: "Additional Advertiser Fee", value: "$12 each" },
        { name: "Included Users", value: "8" },
        { name: "Additional User Fee", value: "$8 each" },
        { name: "AI Insights & Benchmarks", value: "Included" },
        { name: "Aggregated Multi-Network Hub", value: true },
        { name: "Core Reporting & Dashboards", value: true },
        { name: "Unified Application Management", value: true },
        { name: "Partner-Level Aggregation", value: true },
        { name: "Custom Date Ranges / Exports", value: true },
        { name: "Weekly Advertiser Summary", value: true },
        { name: "Automation & Alert Rules", value: "Advanced" },
        { name: "Quarterly AI Audits", value: "2 per Qtr" },
        { name: "White-Label PDFs", value: "Optional add-on" },
        { name: "Dedicated Customer Success Manager", value: "Included" },
        { name: "Onboarding & Data Migration", value: "Guided + config" }
      ]
    },
    {
      name: "Enterprise",
      monthlyPrice: "Contact Us",
      annualPrice: "Contract",
      discount: null,
      features: [
        { name: "Included Advertisers", value: "Custom" },
        { name: "Additional Advertiser Fee", value: "Volume contract" },
        { name: "Included Users", value: "Unlimited" },
        { name: "Additional User Fee", value: "Volume contract" },
        { name: "AI Insights & Benchmarks", value: "Custom models" },
        { name: "Aggregated Multi-Network Hub", value: true },
        { name: "Core Reporting & Dashboards", value: true },
        { name: "Unified Application Management", value: true },
        { name: "Partner-Level Aggregation", value: true },
        { name: "Custom Date Ranges / Exports", value: true },
        { name: "Weekly Advertiser Summary", value: true },
        { name: "Automation & Alert Rules", value: "Full / Custom" },
        { name: "Quarterly AI Audits", value: "Unlimited" },
        { name: "White-Label PDFs", value: "Included" },
        { name: "Dedicated Customer Success Manager", value: "Included" },
        { name: "Onboarding & Data Migration", value: "Fully managed" }
      ],
      buttonText: "Contact Sales"
    }
  ];

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsCheckingOrgs(true);
        
        // Get session from the client-side API
        const response = await fetch('/api/auth/session');
        const sessionData = await response.json();
        console.log("Session data:", sessionData);
        setSession(sessionData);

        // Check if user is logged in based on session data
        const userLoggedIn = !!(sessionData && sessionData.user);
        setIsLoggedIn(userLoggedIn);
        console.log("User logged in:", userLoggedIn);

        if (userLoggedIn) {
          // Only check organizations if the user is logged in
          try {
            const orgsResponse = await fetch('/api/auth/organizations');
            
            // Log the raw response for debugging
            console.log("Raw organizations response status:", orgsResponse.status);
            const contentType = orgsResponse.headers.get('content-type');
            console.log("Organizations response content type:", contentType);
            
            // Even if the response is not OK (e.g., 401, 500), treat it as needing an organization
            // This ensures the pricing page still works even when there are auth issues
            if (!orgsResponse.ok) {
              console.log("Error fetching organizations - treating as needing organization. Status:", orgsResponse.status);
              setNeedsOrganization(true);
              setIsCheckingOrgs(false);
              return;
            }
            
            // Try to parse the response as JSON
            let orgs;
            try {
              orgs = await orgsResponse.json();
              console.log("Organizations:", orgs);
            } catch (jsonError) {
              console.error("Error parsing organizations JSON:", jsonError);
              setNeedsOrganization(true);
              setIsCheckingOrgs(false);
              return;
            }
            
            // Explicitly check if the response is an array and if it's empty
            if (!Array.isArray(orgs)) {
              console.log("Organizations response is not an array:", orgs);
              setNeedsOrganization(true);
            } else if (orgs.length === 0) {
              console.log("User has no organizations");
              setNeedsOrganization(true);
            } else {
              console.log(`User has ${orgs.length} organizations`);
              setNeedsOrganization(false);
              
              // If we get here, the server-side check must have failed to redirect
              // Redirect to dashboard using our helper endpoint
              router.push('/api/auth/get-dashboard-redirect');
            }
          } catch (error) {
            console.error("Error checking organizations:", error);
            setNeedsOrganization(true);
          }
        } else {
          // Not logged in, so we don't need to check organizations
          setNeedsOrganization(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsCheckingOrgs(false);
      }
    };

    checkSession();
  }, [router]);

  const getPriceId = (planType: string, isAnnual: boolean) => {
    const priceIds = {
      starter: {
        annual: 'price_1RMq3cG2mTVYifKmpYpy3EZV',
        monthly: 'price_1RMdUuG2mTVYifKmiH3q0IrJ'
      },
      growth: {
        annual: 'price_1RMq3cG2mTVYifKmpYpy3EZV',
        monthly: 'price_1RMdUuG2mTVYifKmiH3q0IrJ'
      },
      scale: {
        annual: 'price_1RMq3cG2mTVYifKmpYpy3EZV',
        monthly: 'price_1RMdUuG2mTVYifKmiH3q0IrJ'
      }
    };

    const billingType = isAnnual ? 'annual' : 'monthly';
    console.log(`Getting price ID for ${planType} plan, billing type: ${billingType}`);
    
    if (!priceIds[planType as keyof typeof priceIds]) {
      console.log(`Plan type ${planType} not recognized, defaulting to monthly growth plan`);
      return priceIds.growth.monthly;
    }
    
    const selectedPriceId = isAnnual 
      ? priceIds[planType as keyof typeof priceIds].annual 
      : priceIds[planType as keyof typeof priceIds].monthly;
    
    console.log(`Selected ${billingType} price ID for ${planType} plan: ${selectedPriceId}`);
    return selectedPriceId;
  };

  const handleCheckout = async (planType: string, buttonId: string) => {
    if (planType === 'enterprise') {
      window.location.href = '/contact';
      return;
    }

    setActiveButtonId(buttonId);
    
    const isAnnual = Boolean(discount);
    console.log(`Starting checkout for ${planType} plan (${isAnnual ? 'annual' : 'monthly'})`);
    
    if (!isLoggedIn) {
      localStorage.setItem('selected_plan', planType);
      localStorage.setItem('annual_billing', String(isAnnual));
      const returnUrl = encodeURIComponent('/pricing');
      router.push(`/login?redirect=${returnUrl}`);
      return;
    }

    setIsLoading(true);

    try {
      const priceId = getPriceId(planType, isAnnual);
      console.log(`Using price ID: ${priceId}`);
      
      const checkoutData = {
        priceId,
        successUrl: `${window.location.origin}/api/auth/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`
      };

      console.log('Sending checkout data:', JSON.stringify(checkoutData, null, 2));

      try {
        const response = await fetch('/api/auth/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(checkoutData),
        });

        console.log('Response status:', response.status);
        
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        if (!response.ok) {
          console.error('Checkout failed:', response.status, responseText);
          setIsLoading(false);
          setActiveButtonId(null);
          
          setTimeout(() => {
            toast.error(`Checkout failed: ${response.status} ${responseText}`);
          }, 0);
          return;
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (error) {
          console.error('Failed to parse response:', error);
          setIsLoading(false);
          setActiveButtonId(null);
          
          setTimeout(() => {
            toast.error('Invalid response from server');
          }, 0);
          return;
        }
        
        if (data && data.url) {
          console.log('Redirecting to:', data.url);
          
          setTimeout(() => {
            toast.success('Redirecting to checkout...');
            setTimeout(() => {
              window.location.href = data.url;
            }, 500);
          }, 0);
        } else {
          console.error('No URL in response:', data);
          setIsLoading(false);
          setActiveButtonId(null);
          
          setTimeout(() => {
            toast.error('Missing checkout URL');
          }, 0);
        }
      } catch (error) {
        console.error('Request failed:', error);
        setIsLoading(false);
        setActiveButtonId(null);
        
        setTimeout(() => {
          toast.error('Network error');
        }, 0);
      }
    } catch (error) {
      console.error('General error:', error);
      setIsLoading(false);
      setActiveButtonId(null);
      
      setTimeout(() => {
        toast.error('An unexpected error occurred');
      }, 0);
    }
  };

  const config = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-16">
      {isCheckingOrgs ? (
        <div className="mb-6 rounded-md bg-gray-50 p-4 text-gray-800">
          <p className="text-center">Checking your subscription status...</p>
        </div>
      ) : !isLoggedIn ? (
        <div className="mb-6 rounded-md bg-yellow-50 p-4 text-yellow-800">
          <p className="font-medium">You'll need to log in to subscribe</p>
          <p className="text-sm">When you click on a plan, we'll ask you to log in first before proceeding to payment.</p>
        </div>
      ) : needsOrganization ? (
        <div className="mb-6 rounded-md bg-blue-50 p-4 text-blue-800">
          <p className="font-medium">You need to create an organization to continue</p>
          <p className="text-sm">Select a plan below to create your organization and get started.</p>
        </div>
      ) : null}

      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          Scale your affiliate
          <br />
          partnerships effortlessly
        </h1>
        <p className="mb-2 text-gray-600">Choose the perfect plan for your affiliate business.</p>
        <p className="mb-6 text-gray-600">
          Start tracking your partnerships today.
        </p>

        <div className="flex items-center justify-center gap-2">
          <Confetti config={config} active={discount} />
          <Switch
            id="discount"
            checked={discount}
            onCheckedChange={(checked) => {
              console.log("Discount switch toggled:", checked);
              setDiscount(checked);
            }}
          />
          <label htmlFor="discount" className="flex items-center text-sm">
            Annual billing{" "}
            <span className="ml-1 text-blue-500">
              (Save up to {Math.max(...pricingTiers.filter(tier => tier.discount !== null).map(tier => tier.discount || 0))}%)
            </span>
          </label>
        </div>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pricingTiers.map((tier) => (
          <div key={tier.name} className={`rounded-lg border p-6 ${tier.isPopular ? 'border-blue-500' : ''}`}>
            {tier.isPopular && (
              <Badge className="mb-4 bg-blue-500">Most Popular</Badge>
            )}
            <h2 className="mb-4 text-xl font-medium">{tier.name}</h2>
            <div className="mb-6">
              <div className="flex items-end">
                <span className="text-3xl font-bold">
                  {typeof tier.monthlyPrice === 'number' 
                    ? `$${discount ? (tier.monthlyPrice * (1 - (tier.discount || 0) / 100)).toFixed(0) : tier.monthlyPrice}`
                    : tier.monthlyPrice}
                </span>
                {typeof tier.monthlyPrice === 'number' && (
                  <span className="ml-1 text-sm text-gray-500">
                    per<br />month
                  </span>
                )}
              </div>
              {tier.discount && discount && (
                <p className="mt-2 text-sm text-green-600">
                  Save {tier.discount}% with annual billing
                </p>
              )}
            </div>

            <Button
              className="mb-6 w-full"
              variant={tier.name === "Enterprise" ? "outline" : "primary"}
              onClick={() => handleCheckout(tier.name.toLowerCase(), `${tier.name.toLowerCase()}-button`)}
              disabled={isCheckingOrgs || isLoading || activeButtonId === `${tier.name.toLowerCase()}-button`}
            >
              {isLoading && activeButtonId === `${tier.name.toLowerCase()}-button` 
                ? "Loading..." 
                : tier.buttonText || "Get Started"}
            </Button>

            <div className="space-y-4">
              {tier.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start gap-2">
                  {typeof feature.value === 'boolean' ? (
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <span className="text-sm">{feature.value}</span>
                  )}
                  <span className="text-sm text-gray-600">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link href="/contact" className="text-primary hover:underline">
          Need a custom enterprise solution?
        </Link>
      </div>
    </div>
  );
} 