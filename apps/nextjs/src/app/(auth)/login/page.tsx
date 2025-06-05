import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";
import { db } from "@acme/db/client";

import { LoginForm } from "./_components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  // Get the redirect URL from search params if available
  const redirectUrl = searchParams.redirect || "/";
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    const organizationId = session.session.activeOrganizationId;

    console.log("Active organization ID:", organizationId);
    
    // If user is already logged in but doesn't have an organization
    // and they're trying to go to pricing, let them continue
    if (!organizationId && redirectUrl === "/pricing") {
      console.log("Redirecting to pricing page as requested");
      return redirect("/pricing");
    }

    // If no organization, redirect to pricing as default
    if (!organizationId) {
      console.log("No active organization, redirecting to pricing");
      return redirect("/pricing");
    }

    const org = await db.query.organization.findFirst({
      where: (org, { eq }) => eq(org.id, organizationId),
    });

    // If organization not found, redirect to pricing
    if (!org) {
      console.log("Organization not found, redirecting to pricing");
      return redirect("/pricing");
    }

    // Organization exists, redirect to org page
    console.log("Redirecting to organization:", org.slug);
    return redirect(`/${org.slug}`);
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm redirectUrl={redirectUrl} />
      </div>
    </div>
  );
}
