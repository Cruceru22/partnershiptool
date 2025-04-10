import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface WorkspaceLinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export const WorkspaceLink = ({
  href,
  children,
  className,
}: WorkspaceLinkProps) => {
  const params = useParams();

  return (
    <Link href={`/${params.workspace as string}${href}`} className={className}>
      {children}
    </Link>
  );
};
