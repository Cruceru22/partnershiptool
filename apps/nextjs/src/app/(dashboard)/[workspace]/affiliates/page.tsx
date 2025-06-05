"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@acme/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../../../packages/ui/src/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../../../../packages/ui/src/tabs";
import { Badge } from "@acme/ui/badge";
import { Check, X } from "lucide-react";

interface ShareASaleAffiliate {
  userId: string;
  organization: string;
  website: string;
  country: string;
  state: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  notes?: string;
  feedbackCount?: number;
  feedbackAverage?: number;
  feedbackRating?: string;
  status: "pending" | "approved" | "declined";
  signupDate: string;
  tags?: string;
}

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<ShareASaleAffiliate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [statusOverrides, setStatusOverrides] = useState<Record<string, "pending" | "approved" | "declined">>({});

  useEffect(() => {
    // Load status overrides from localStorage
    const saved = localStorage.getItem('affiliate-status-overrides');
    if (saved) {
      try {
        setStatusOverrides(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading status overrides:', error);
      }
    }
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/affiliate/shareasale/affiliates");
      if (response.ok) {
        const data = await response.json();
        setAffiliates(data);
      }
    } catch (error) {
      console.error("Error fetching affiliates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get the real status (considering overrides)
  const getRealStatus = (affiliate: ShareASaleAffiliate): "pending" | "approved" | "declined" => {
    return statusOverrides[affiliate.userId] || affiliate.status;
  };

  // Helper function to update status override
  const updateStatusOverride = (affiliateId: string, newStatus: "pending" | "approved" | "declined") => {
    const newOverrides = { ...statusOverrides, [affiliateId]: newStatus };
    setStatusOverrides(newOverrides);
    localStorage.setItem('affiliate-status-overrides', JSON.stringify(newOverrides));
  };

  // Helper function to ensure proper URL format
  const formatWebsiteUrl = (url: string) => {
    if (!url) return "#";
    // If URL doesn't start with http:// or https://, add https://
    if (!url.match(/^https?:\/\//)) {
      return `https://${url}`;
    }
    return url;
  };

  // Helper function to handle website link clicks
  const handleWebsiteClick = (url: string) => {
    const formattedUrl = formatWebsiteUrl(url);
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  const handleApprove = async (affiliateId: string) => {
    try {
      setActionLoading(affiliateId);
      const response = await fetch("/api/affiliate/shareasale/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ affiliateId }),
      });

      if (response.ok) {
        // Update the status override
        updateStatusOverride(affiliateId, "approved");
      } else {
        const error = await response.json();
        alert(`Failed to approve affiliate: ${error.error}`);
      }
    } catch (error) {
      console.error("Error approving affiliate:", error);
      alert("Failed to approve affiliate");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (affiliateId: string) => {
    try {
      setActionLoading(affiliateId);
      const response = await fetch("/api/affiliate/shareasale/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ affiliateId }),
      });

      if (response.ok) {
        // Update the status override
        updateStatusOverride(affiliateId, "declined");
      } else {
        const error = await response.json();
        alert(`Failed to decline affiliate: ${error.error}`);
      }
    } catch (error) {
      console.error("Error declining affiliate:", error);
      alert("Failed to decline affiliate");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "declined":
        return <Badge className="bg-red-100 text-red-800">Declined</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter functions for each tab
  const getAllAffiliates = () => affiliates;
  const getApprovedAffiliates = () => affiliates.filter(a => getRealStatus(a) === "approved");
  const getRejectedAffiliates = () => affiliates.filter(a => getRealStatus(a) === "declined");
  const getPendingAffiliates = () => affiliates.filter(a => getRealStatus(a) === "pending");

  // Render table for a specific set of affiliates
  const renderAffiliatesTable = (filteredAffiliates: ShareASaleAffiliate[]) => (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Affiliate ID</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Signup Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <span className="ml-2">Loading affiliates...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredAffiliates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No affiliates found
              </TableCell>
            </TableRow>
          ) : (
            filteredAffiliates.map((affiliate, index) => (
              <TableRow key={`${affiliate.userId}-${affiliate.email}-${index}`}>
                <TableCell className="font-medium">{affiliate.userId}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{affiliate.organization}</span>
                    {affiliate.notes && (
                      <span className="text-xs text-muted-foreground">{affiliate.notes}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleWebsiteClick(affiliate.website)}
                    className="text-blue-600 hover:underline text-left cursor-pointer"
                  >
                    {affiliate.website}
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{affiliate.country}</span>
                    {affiliate.state && <span className="text-muted-foreground">{affiliate.state}</span>}
                    {affiliate.city && <span className="text-muted-foreground">{affiliate.city}</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    {affiliate.email && <span>{affiliate.email}</span>}
                    {affiliate.phone && <span className="text-muted-foreground">{affiliate.phone}</span>}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(getRealStatus(affiliate))}
                </TableCell>
                <TableCell>{formatDate(affiliate.signupDate)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(affiliate.userId)}
                      disabled={getRealStatus(affiliate) === "approved" || actionLoading === affiliate.userId}
                      className="text-green-600 hover:text-green-700"
                    >
                      {actionLoading === affiliate.userId ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span className="ml-1">Approve</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecline(affiliate.userId)}
                      disabled={getRealStatus(affiliate) === "declined" || actionLoading === affiliate.userId}
                      className="text-red-600 hover:text-red-700"
                    >
                      {actionLoading === affiliate.userId ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span className="ml-1">Decline</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ShareASale Affiliate Management</h1>
        <Button onClick={fetchAffiliates} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All Applications ({affiliates.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({getPendingAffiliates().length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({getApprovedAffiliates().length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({getRejectedAffiliates().length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderAffiliatesTable(getAllAffiliates())}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {renderAffiliatesTable(getPendingAffiliates())}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {renderAffiliatesTable(getApprovedAffiliates())}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {renderAffiliatesTable(getRejectedAffiliates())}
        </TabsContent>
      </Tabs>
    </div>
  );
} 