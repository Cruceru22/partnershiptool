import { getSession } from "@acme/auth";
import { redirect } from "next/navigation";
import { db } from "@acme/db/client";
import { member } from "@acme/db/schema";

// Make the page a server component
export default async function PricingPage() {
  // Check if user has organizations and redirect if needed
  const session = await getSession();
  
  if (session?.user?.id) {
    try {
      // Check if the user has any organizations
      const userMemberships = await db.query.member.findMany({
        where: (members, { eq }) => eq(members.userId, session.user.id),
      });
      
      if (userMemberships && userMemberships.length > 0) {
        console.log("User has organizations, redirecting to dashboard");
        redirect('/dashboard');
      }
    } catch (error) {
      console.error("Error checking user organizations:", error);
    }
  }
  
  // Import the client component
  const ClientPricingPage = (await import('./_components/pricing-client')).default;
  
  // Render the client component
  return <ClientPricingPage />;
}
