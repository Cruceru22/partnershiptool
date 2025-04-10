import React from "react";

export default function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="bg-background">
      {children}
    </div>
  );
}
