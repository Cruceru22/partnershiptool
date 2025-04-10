import * as React from "react";

import type { Session } from "@acme/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@acme/ui/sidebar";
import { ThemeToggle } from "@acme/ui/theme";

import NavMain from "./nav-main";
import NavUser from "./nav-user";
import UsageInfo from "./usage-info";
import { WorkspaceSwitcher } from "./workspace-switcher";

export function AppSidebar({ user }: { user: Session["user"] }) {
  return (
    <Sidebar
      // variant="inset"
      collapsible="icon"
      className="group/sidebar-wrapper"
    >
      <SidebarContent className="flex h-full flex-col bg-card text-card-foreground">
        <SidebarHeader>
          <WorkspaceSwitcher />
        </SidebarHeader>  

        <NavMain />

        <SidebarFooter className="mt-auto">
          <ThemeToggle />

          <UsageInfo />
          <NavUser user={user} />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
