import React from "react";
import Image from "next/image";

import { Marquee } from "./marquee";

const companies = [
  {
    name: "kairoskraft",
    logo: "kairoskraft.png",
    hasText: false,
    width: 30,
    height: 30,
  },
];

export const LandingLogo = () => {
  return (
    <section className="py-8">
      <div className="flex flex-col gap-2 rounded-xl bg-background p-4">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          hmmmmm, we don't have big companies yet, but these are some cool ones
          i like
        </p>

        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center overflow-hidden">
          <Marquee repeat={5} pauseOnHover className="[--duration:20s]">
            {companies.map((company) =>
              company.hasText ? (
                <Image
                  key={company.name}
                  src={`/companies/${company.logo}`}
                  alt={company.name}
                  width={company.width}
                  height={company.height}
                />
              ) : (
                <div key={company.name} className="flex items-center gap-2">
                  <Image
                    className="grayscale"
                    src={`/companies/${company.logo}`}
                    alt={company.name}
                    width={company.width}
                    height={company.height}
                  />
                  <span className="font-bold">{company.name}</span>
                </div>
              ),
            )}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
      </div>
    </section>
  );
};
