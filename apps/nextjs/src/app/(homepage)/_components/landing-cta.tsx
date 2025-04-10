import React from "react";
import Link from "next/link";

import { Button } from "@acme/ui/button";

export const LandingCTA = () => {
  return (
    <section className="flex flex-col items-center py-24">
      <h2 className="text-3xl font-bold tracking-tight">
        yo wtf are you waiting for?
      </h2>
      <p className="text-lg">
        you scrolled all the way down, you must be serious, just get started,
        for real
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button size="lg" asChild>
          <Link href="/signup">start yo, just do it</Link>
        </Button>
        <Button size="lg" variant="outline">
          Book a demo
        </Button>
      </div>
    </section>
  );
};
