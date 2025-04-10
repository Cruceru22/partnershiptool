import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";
import { db } from "@acme/db/client";

import { SignupForm } from "./_components/signup-form";

export default async function SignupPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    const organizationId = session.session.activeOrganizationId;

    console.log(organizationId);
    if (!organizationId) redirect("/");

    const org = await db.query.organization.findFirst({
      where: (org, { eq }) => eq(org.id, organizationId),
    });

    if (!org) redirect("/");

    redirect(`/${org.slug}`);
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  );
}
