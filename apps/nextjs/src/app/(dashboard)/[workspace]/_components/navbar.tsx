"use client";

import Link from "next/link";

import { Button } from "@acme/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@acme/ui/navigation-menu";

export default function Navbar() {
  return (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-16 py-4">
      <Link href="/" className="text-xl font-bold hover:opacity-80">
        Partnership tool
      </Link>

      <NavigationMenu>
        <NavigationMenuList className="space-x-0.3 hidden lg:flex">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Product</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[200px] p-4">
                <ul className="space-y-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/product/overview"
                        className="block hover:text-primary"
                      >
                        Overview
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/product/features"
                        className="block hover:text-primary"
                      >
                        Features
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/product/pricing"
                        className="block hover:text-primary"
                      >
                        Pricing
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[200px] p-4">
                <ul className="space-y-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/resources/docs"
                        className="block hover:text-primary"
                      >
                        Docs
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/resources/support"
                        className="block hover:text-primary"
                      >
                        Support
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Company</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[200px] p-4">
                <ul className="space-y-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/company/about"
                        className="block hover:text-primary"
                      >
                        About
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/company/careers"
                        className="block hover:text-primary"
                      >
                        Careers
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Enterprise</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[200px] p-4">
                <ul className="space-y-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/enterprise/solutions"
                        className="block hover:text-primary"
                      >
                        Solutions
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/enterprise/security"
                        className="block hover:text-primary"
                      >
                        Security
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground"
            >
              <Link href="/blog" className="hover:text-primary">
                Blog
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none data-[active]:bg-accent data-[state=open]:bg-accent data-[active]:text-accent-foreground data-[state=open]:text-accent-foreground"
            >
              <Link href="/pricing" className="hover:text-primary">
                Pricing
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden space-x-2 sm:flex">
        <Button variant="outline" className="hover:bg-transparent" asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}
