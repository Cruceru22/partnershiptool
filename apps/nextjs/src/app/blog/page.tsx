"use client";

import { LandingNavbar } from "../(homepage)/_components/landing-navbar";
import { BlogList } from "../(homepage)/_components/blog-list";

export default function BlogPage() {
    
    return (
        <div className="mx-auto flex min-h-screen flex-col px-4 sm:max-w-5xl sm:px-8">
            <LandingNavbar />
            <BlogList />
        </div>
    )
}