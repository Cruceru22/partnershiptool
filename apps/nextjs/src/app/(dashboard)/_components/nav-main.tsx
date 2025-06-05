"use client";

import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { UsersIcon, HomeIcon, FileIcon, UserCheck } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@acme/ui/sidebar";

import { WorkspaceLink } from "~/components/workspace-link";

const items = [
  {
    title: "Dashboard",
    icon: HomeIcon,
    isRootPath: true,
  },
  {
    title: "Members",
    href: "/members",
    icon: UsersIcon,
  },
  {
    title: "Affiliates",
    href: "/affiliates",
    icon: UserCheck,
  },
  {
    title: "Weekly AI Report",
    href: "/weekly-ai-report",
    icon: FileIcon,
  },
] as { title: string; icon: LucideIcon; href?: string }[];

export default function NavMain() {
  const pathname = usePathname();
  const params = useParams();

  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  useEffect(() => {
    if (isMobile && !isCollapsed) {
      toggleSidebar();
    }
  }, [pathname, isMobile, isCollapsed, toggleSidebar]);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              pathname === `/${params.workspace as string}${item.href ?? ""}`;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <WorkspaceLink
                    href={item.href}
                    className={`flex items-center gap-2 px-2 py-1 ${
                      isActive
                        ? "bg-accent text-primary outline outline-muted-foreground"
                        : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </WorkspaceLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
