"use client";

import React from "react";
import Link from "next/link";

import { Button } from "@acme/ui/button";

interface LandingCTAProps {
  userState: string;
}

export const LandingCTA = ({ userState }: LandingCTAProps) => {
  return (
    <section className="flex flex-col items-center py-24">
      <h2 className="text-3xl font-bold tracking-tight">
        What are you waiting for?
      </h2>
      <p className="text-lg">
        you scrolled all the way down, you must be serious, just get started,
        for real
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
        
        <Button size="lg" variant="outline">
          Book a demo
        </Button>
      </div>
    </section>
  );
};
