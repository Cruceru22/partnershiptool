import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@acme/ui/sidebar";

import { AppSidebar } from "./_components/app-sidebar";
import NavigationBreadcrumb from "./_components/navigation-breadcrumb";
import { BackgroundMain } from "./[workspace]/_components/background-main";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <SidebarInset>
        <main className="flex h-screen flex-col">
          <BackgroundMain />
          <header className="flex h-16 w-full shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <NavigationBreadcrumb />
            </div>
          </header>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
