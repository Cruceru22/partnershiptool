"use client";

import { LandingCTA } from "./_components/landing-cta";
import { LandingFeatures } from "./_components/landing-features";
import { LandingFooter } from "./_components/landing-footer";
import { LandingLogo } from "./_components/landing-logo";
import { LandingMain } from "./_components/landing-main";
import { LandingNavbar } from "./_components/landing-navbar";

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen flex-col px-4 sm:max-w-5xl sm:px-8">
      <LandingNavbar />
      <LandingMain />
      <LandingLogo />
      <LandingFeatures />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
