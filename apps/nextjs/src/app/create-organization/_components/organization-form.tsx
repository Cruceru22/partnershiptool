"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";
import Confetti from "react-dom-confetti";

import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";

interface Step {
  id: string;
  title: string;
  description: string;
  field: string;
  placeholder: string;
  isRequired?: boolean;
  isMultiField?: boolean;
}

const steps: Step[] = [
  {
    id: "org-name",
    title: "Name your organization",
    description: "This is how your organization will be displayed.",
    field: "orgName",
    placeholder: "My Awesome Team",
    isRequired: true
  },
  {
    id: "share-a-sale",
    title: "ShareASale Integration",
    description: "Connect your ShareASale affiliate network (optional).",
    field: "shareASaleKey",
    placeholder: "ShareASale API Key"
  },
  {
    id: "awin",
    title: "Awin Integration",
    description: "Connect your Awin affiliate network (optional).",
    field: "awinKey",
    placeholder: "Awin API Key"
  },
  {
    id: "impact",
    title: "Impact Integration",
    description: "Connect your Impact affiliate network (optional).",
    field: "impactKey",
    placeholder: "Impact API Key"
  },
  {
    id: "everflow",
    title: "Everflow Integration",
    description: "Connect your Everflow affiliate network (optional).",
    field: "everflowKey",
    placeholder: "Everflow API Key"
  },
  {
    id: "cj",
    title: "Commission Junction Integration",
    description: "Connect your CJ affiliate network (optional).",
    field: "cjKey",
    placeholder: "Commission Junction API Key"
  },
  {
    id: "rakuten",
    title: "Rakuten Integration",
    description: "Connect your Rakuten affiliate network (optional).",
    field: "rakuten",
    placeholder: "Rakuten Credentials",
    isMultiField: true
  },
  {
    id: "partnerize",
    title: "Partnerize Integration",
    description: "Connect your Partnerize affiliate network (optional).",
    field: "partnerizeKey",
    placeholder: "Partnerize API Key"
  }
];

export function OrganizationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    orgName: "",
    shareASaleKey: "",
    awinKey: "",
    impactKey: "",
    everflowKey: "",
    cjKey: "",
    rakutenKey: "",
    rakutenSecret: "",
    partnerizeKey: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const confettiConfig = {
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
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepComplete = (e: FormEvent) => {
    e.preventDefault();
    const step = steps[currentStep];
    if (!step) return;

    // For required fields, validate input
    if (step.isRequired && !formData[step.field as keyof typeof formData]) {
      setError(`${step.title} is required`);
      return;
    }

    // Clear any previous errors
    setError("");

    if (currentStep < steps.length - 1) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setCurrentStep(prev => prev + 1);
      }, 1000);
    } else {
      handleSubmit();
    }
  };

  const handleSkip = () => {
    const step = steps[currentStep];
    if (!step) return;
    
    if (step.isRequired) {
      return;
    }
    
    if (step.isMultiField) {
      setFormData(prev => ({
        ...prev,
        rakutenKey: "",
        rakutenSecret: ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [step.field]: ""
      }));
    }

    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setCurrentStep(prev => prev + 1);
    }, 1000);

    if (currentStep === steps.length - 1) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!formData.orgName.trim()) {
      setError("Please enter an organization name");
      setCurrentStep(0);
      return;
    }

    setIsLoading(true);
    setError("");
    console.log("Starting organization creation for:", formData.orgName);

    const submitData = {
      name: formData.orgName.trim(),
      shareASaleKey: formData.shareASaleKey || "",
      awinKey: formData.awinKey || "",
      impactKey: formData.impactKey || "",
      everflowKey: formData.everflowKey || "",
      cjKey: formData.cjKey || "",
      rakutenKey: formData.rakutenKey || "",
      rakutenSecret: formData.rakutenSecret || "",
      partnerizeKey: formData.partnerizeKey || ""
    };

    try {
      const response = await fetch("/api/auth/create-organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Error processing response:", parseError);
        throw new Error("Failed to process server response");
      }

      if (response.ok) {
        if (data.error) {
          throw new Error(data.error);
        }

        console.log("Organization creation successful:", data.organization);
        setIsRedirecting(true);
        setShowConfetti(true);

        const orgId = data.organization?.id;
        const orgSlug = data.organization?.slug;

        if (!orgId) {
          throw new Error("No organization ID in response");
        }

        try {
          const setActiveResponse = await fetch('/api/auth/set-active-organization', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              organizationId: orgId,
            }),
          });

          if (!setActiveResponse.ok) {
            throw new Error("Failed to set active organization");
          }

          await fetch('/api/auth/session');
          await new Promise((resolve) => setTimeout(resolve, 1000));

          if (orgSlug) {
            window.location.href = `/${orgSlug}`;
          } else {
            window.location.href = `/api/auth/get-dashboard-redirect`;
          }
        } catch (activeOrgError) {
          console.error("Error setting active organization:", activeOrgError);
          if (orgSlug) {
            window.location.href = `/${orgSlug}`;
          } else {
            window.location.href = `/api/auth/get-dashboard-redirect`;
          }
        }
      } else {
        throw new Error(data.error || data.details || "Failed to create organization");
      }
    } catch (err: any) {
      console.error("Final error creating organization:", err);
      setError(err.message || "Failed to create organization");
      setIsLoading(false);
    }
  };

  const currentStepData = steps[currentStep];
  
  if (!currentStepData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error: Invalid step configuration
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        {isRedirecting ? (
          <div className="text-center py-8">
            <Confetti active={showConfetti} config={confettiConfig} />
            <h3 className="text-lg font-medium mb-2">Organization created successfully!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting you to your workspace...
            </p>
            <div className="flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          </div>
        ) : (
          <Dialog open={true}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{currentStepData.title}</DialogTitle>
                <DialogDescription>
                  {currentStepData.description}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleStepComplete} className="grid gap-4 py-4">
                {error && currentStep === 0 && (
                  <div className="rounded bg-red-100 p-2 text-center text-sm text-red-600">
                    {error}
                  </div>
                )}
                <Confetti active={showConfetti} config={confettiConfig} />
                {currentStepData.isMultiField ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rakutenKey">Rakuten Client ID</Label>
                      <Input
                        id="rakutenKey"
                        placeholder="Enter Client ID"
                        value={formData.rakutenKey}
                        onChange={(e) => handleInputChange('rakutenKey', e.target.value)}
                        disabled={isLoading}
                        type="password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rakutenSecret">Rakuten Client Secret</Label>
                      <Input
                        id="rakutenSecret"
                        placeholder="Enter Client Secret"
                        value={formData.rakutenSecret}
                        onChange={(e) => handleInputChange('rakutenSecret', e.target.value)}
                        disabled={isLoading}
                        type="password"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor={currentStepData.id}>{currentStepData.title}</Label>
                    <Input
                      id={currentStepData.id}
                      placeholder={currentStepData.placeholder}
                      value={formData[currentStepData.field as keyof typeof formData]}
                      onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
                      disabled={isLoading}
                      required={currentStepData.isRequired}
                      type={currentStepData.field === 'orgName' ? 'text' : 'password'}
                    />
                  </div>
                )}
                <div className="flex justify-between mt-4">
                  {!currentStepData.isRequired && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSkip}
                      disabled={isLoading}
                    >
                      Skip
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isLoading || (currentStepData.isRequired && !formData[currentStepData.field as keyof typeof formData])}
                  >
                    {currentStep === steps.length - 1 ? "Create Organization" : "Next"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
} 