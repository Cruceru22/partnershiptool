"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@acme/ui/button";

export default function DebugPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [orgInfo, setOrgInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Check session
        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();
        setSessionInfo(sessionData);
        
        // Check organizations if logged in
        if (sessionData?.user) {
          try {
            const orgsResponse = await fetch('/api/auth/organizations');
            const orgsData = await orgsResponse.json();
            setOrgInfo(orgsData);
          } catch (e) {
            console.error("Error fetching organizations:", e);
            setOrgInfo("Error fetching organizations");
          }
        }
        
        // Check for URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('error')) {
          setError(`Error: ${urlParams.get('error')}`);
        }
        if (urlParams.has('message')) {
          setMessage(urlParams.get('message'));
        }
      } catch (e) {
        console.error("Error:", e);
        setError("An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const forceCreateOrganization = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/debug-create-org');
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setMessage(data.message || "Organization created successfully");
        // Refresh data
        window.location.href = '/debug?message=Organization+created+successfully';
      }
    } catch (e) {
      console.error("Error creating organization:", e);
      setError("Failed to create organization");
    } finally {
      setIsLoading(false);
    }
  };

  const userStatus = sessionInfo?.user ? "Logged in" : "Not logged in";
  const orgStatus = Array.isArray(orgInfo) 
    ? (orgInfo.length > 0 ? `Has ${orgInfo.length} organizations` : "No organizations") 
    : "Unknown";

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Debug Page</h1>
      
      {message && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-green-800">
          {message}
          <button 
            className="ml-2 text-sm underline" 
            onClick={() => setMessage(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-800">
          {error}
          <button 
            className="ml-2 text-sm underline" 
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="mb-6 text-gray-500">Loading...</div>
      ) : (
        <div className="mb-8 space-y-4">
          <div className="rounded-md bg-gray-50 p-4">
            <h2 className="mb-2 font-semibold">User Status: {userStatus}</h2>
            {sessionInfo?.user && (
              <div>
                <p><strong>Email:</strong> {sessionInfo.user.email}</p>
                <p><strong>Name:</strong> {sessionInfo.user.name}</p>
                <p><strong>ID:</strong> {sessionInfo.user.id}</p>
              </div>
            )}
          </div>
          
          <div className="rounded-md bg-gray-50 p-4">
            <h2 className="mb-2 font-semibold">Organization Status: {orgStatus}</h2>
            {Array.isArray(orgInfo) && orgInfo.length > 0 && (
              <div>
                <p><strong>First Org:</strong> {orgInfo[0].name}</p>
                <p><strong>Org ID:</strong> {orgInfo[0].id}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mb-8 space-y-4 rounded-md bg-blue-50 p-4">
        <h2 className="text-xl font-bold">Direct Links</h2>
        <p>These links bypass the middleware to help diagnose issues:</p>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link href="/pricing" passHref>
            <Button className="w-full">Go to Pricing Page</Button>
          </Link>
          
          <Link href="/login" passHref>
            <Button variant="outline" className="w-full">Go to Login Page</Button>
          </Link>
          
          <Link href="/api/auth/logout" passHref>
            <Button variant="destructive" className="w-full">Logout</Button>
          </Link>
          
          <Link href="/dashboard" passHref>
            <Button variant="outline" className="w-full">Go to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="mb-8 space-y-4 rounded-md bg-orange-50 p-4">
        <h2 className="text-xl font-bold">Debug Actions</h2>
        <p>These actions help diagnose and fix account issues:</p>
        
        <div className="grid grid-cols-1 gap-4">
          <Button 
            variant="primary"
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={forceCreateOrganization}
            disabled={isLoading}
          >
            Force Create Organization
          </Button>
          
          <p className="text-sm text-gray-700">
            Use this button to force-create an organization for the current user. This can help if you're 
            stuck in a state where you're logged in but can't access the dashboard because you don't have an organization.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-md bg-yellow-50 p-4">
        <h2 className="text-xl font-bold">Test Plan Selection</h2>
        <p>Click these buttons to test the Stripe integration directly:</p>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link href="/api/auth/create-checkout-session?price=free" passHref>
            <Button variant="outline" className="w-full">
              Select Free Plan
            </Button>
          </Link>
          
          <Link href="/api/auth/create-checkout-session?price=pro" passHref>
            <Button variant="outline" className="w-full">
              Select Pro Plan
            </Button>
          </Link>
          
          <Link href="/api/auth/create-checkout-session?price=business" passHref>
            <Button variant="outline" className="w-full">
              Select Business Plan
            </Button>
          </Link>
          
          <Link href="/api/auth/create-checkout-session?price=pro&annual=true" passHref>
            <Button variant="outline" className="w-full">
              Pro Plan (Annual)
            </Button>
          </Link>
          
          <Link href="/api/auth/create-checkout-session?price=business&annual=true" passHref>
            <Button variant="outline" className="w-full">
              Business Plan (Annual)
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 