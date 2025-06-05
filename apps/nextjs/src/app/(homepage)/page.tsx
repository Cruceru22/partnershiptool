import { getSession } from "@acme/auth";
import { db } from "@acme/db/client";
import { member } from "@acme/db/schema";

import { BlogSection } from "./_components/blog-section";
import { LandingCTA } from "./_components/landing-cta";
import { LandingFeatures } from "./_components/landing-features";
import { LandingMain } from "./_components/landing-main";
import { LandingNavbar } from "./_components/landing-navbar";
import { Button } from "@acme/ui/button";
import Link from "next/link";

export default async function HomePage() {
  // Get the user session
  const session = await getSession();
  
  // Default state (not logged in)
  let userState = "not-logged-in";
  
  if (session?.user) {
    try {
      // Check if the user has any organizations by directly querying the database
      const userMemberships = await db.query.member.findMany({
        where: (members, { eq }) => eq(members.userId, session.user.id),
      });
      
      if (userMemberships && userMemberships.length > 0) {
        userState = "has-organization";
        console.log("User has organizations:", userMemberships.length);
      } else {
        userState = "no-organization";
        console.log("User has no organizations");
      }
    } catch (error) {
      console.error("Error checking user organizations:", error);
      userState = "no-organization";
    }
  }
  
  return (
    <div className="mx-auto flex min-h-screen flex-col px-4 sm:max-w-5xl sm:px-8">
      <LandingNavbar />
      <LandingMain userState={userState} />
      <LandingFeatures />
      <LandingCTA userState={userState} />
    </div>
  );
}
