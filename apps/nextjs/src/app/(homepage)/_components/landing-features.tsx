import React from "react";
import Image from "next/image";

interface LandingFeatureProps {
  title: string;
  description: string;
  image: string;
}

export const LandingFeature = ({
  title,
  description,
  image,
}: LandingFeatureProps) => {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="relative h-72 w-full">
        <div className="absolute inset-x-0 -bottom-4 z-10 h-full rounded-t-xl bg-gradient-to-t from-white to-transparent"></div>
        <Image
          src={image}
          alt={title}
          fill
          className="rounded-t-xl object-cover shadow"
        />
      </div>
      <div className="max-w-sm">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export const LandingFeatures = () => {
  return (
    <section className="flex flex-col gap-12 pt-20">
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="max-w-lg text-balance text-center text-3xl font-semibold tracking-tight">
          All your affiliate tools in one place
        </h2>
        <p className="max-w-md text-center text-lg text-muted-foreground">
          compare all your affiliate tools in one place
          <br />
         and just let people do their thing
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8 divide-neutral-200 sm:divide-x">
          <LandingFeature
            image="https://via.placeholder.com/300"
            title="compare tools"
            description="compare all your affiliate tools in one place"
          />
          <LandingFeature
            image="https://via.placeholder.com/300"
            title="get reports"
            description="get reports weekly about your performance"
          />
        </div>

        <div className="flex flex-col gap-8 divide-neutral-200 sm:divide-x [&>*]:border-t [&>*]:border-neutral-200">
          <LandingFeature
            image="https://via.placeholder.com/300"
            title="all your tools in one place"
            description="you can just store the tools here, like we don't ask more, do as you wish could be cheaper"
          />
          <LandingFeature
            image="https://via.placeholder.com/300"
            title="chill with your team"
            description="you can have your people and check the statistics, like from the same place, literally easy"
          />
        </div>  
      </div>
    </section>
  );
};
