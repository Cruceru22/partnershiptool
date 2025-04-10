"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Check, Copy } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@acme/ui/breadcrumb";
import { Button } from "@acme/ui/button";
import { Icon } from "@acme/ui/icon";
import { Separator } from "@acme/ui/separator";

import { WorkspaceLink } from "~/components/workspace-link";
import { useTRPC } from "~/trpc/react";

const NavigationBreadcrumb = () => {
  const params = useParams();
  const [copied, setCopied] = useState(false);

  const trpc = useTRPC();
  const { data: video } = useQuery(
    trpc.video.byId.queryOptions(params.id as string, {
      enabled: !!params.id,
    }),
  );

  const handleCopyToClipboard = async () => {
    if (!video) return;

    const shareUrl = `${window.location.origin}/c/${params.id as string}`;
    await navigator.clipboard.writeText(shareUrl);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!params.id || !video) return null;

  return (
    <>
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <WorkspaceLink href="/">home</WorkspaceLink>
          </BreadcrumbItem>
          {video.title && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />

              <BreadcrumbItem>
                <BreadcrumbPage>{video.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <Button className="ml-auto gap-2" onClick={handleCopyToClipboard}>
        {copied ? (
          <>
            <Icon as={Check} />
            copied the link
          </>
        ) : (
          <>
            <Icon as={Copy} />
            share with someone:))
          </>
        )}
      </Button>
    </>
  );
};

export default NavigationBreadcrumb;
