import React from "react";
import Link from "next/link";

import { Button } from "@acme/ui/button";

import { LandingDropzone } from "./landing-dropzone";

export const LandingMain = () => {
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
            feedback for your videos
            <br />
            <span>made simple</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl">
            just upload a video and share the link
            <br />
            get instant feedback from the ones you care about
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Start for free</Link>
            </Button>
            <Button variant="outline" size="lg">
              Get a demo
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-sm text-muted-foreground"> or</p>
          <p className="text-md font-mono font-semibold tracking-tighter">
            {" "}
            Don't trust us, literally upload a video
          </p>

          <LandingDropzone />
        </div>
      </div>
    </section>
  );
};
