"use client";

import React from "react";
import Link from "next/link";

import { Button } from "@acme/ui/button";

import { LandingDropzone } from "./landing-dropzone";

interface LandingMainProps {
  userState: string;
}

export const LandingMain = ({ userState }: LandingMainProps) => {
  // You can adjust the opacity value here (0.0 to 1.0)

  return (
    <section className="noise-bg-accent relative flex flex-col overflow-hidden rounded-2xl bg-orange-50 py-12 dark:bg-orange-950">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/mask-test.png)", // Replace with your image path
          backgroundPosition: "center",
          backgroundSize: "cover",
          opacity: 0.4,
        }}
      />

      {/* Overlay for better text readability (optional) */}

      {/* Content with higher z-index to appear above the background */}
      <div className="relative z-10">
        {/* Main Heading */}
        <div className="flex w-full flex-col text-center">
          <h1 className="text-5xl font-semibold tracking-tight">
            All your affiliate tools in one place
            <br />
            <span>made simple</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl">
            compare all your affiliate tools in one place
            <br />
            get reports weekly about your performance
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {userState === "not-logged-in" && (
              <Button size="lg" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            )}
            
            {userState === "no-organization" && (
              <Button size="lg" asChild>
                <Link href="/pricing">Create Your Organization</Link>
              </Button>
            )}
            
            {userState === "has-organization" && (
              <Button size="lg" asChild>
                <Link href="/api/auth/get-dashboard-redirect">Go to Workspace</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
