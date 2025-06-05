import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@acme/auth";

import { OrganizationForm } from "./_components/organization-form";

export default async function CreateOrganizationPage() {
  const session = await getSession();
  
  // If not logged in, redirect to login
  if (!session) {
    return redirect('/login?redirect=/create-organization');
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create your organization</h1>
          <p className="text-muted-foreground">
            Your payment was successful! Now let's set up your organization.
          </p>
        </div>
        <OrganizationForm />
      </div>
    </div>
  );
} 