"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";
import { toast } from "@acme/ui/toast";

import { LandingNavbar } from "../../(homepage)/_components/landing-navbar";
import { useTRPC } from "~/trpc/react";

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id as string;
  
  const trpc = useTRPC();
  const { data: post, isLoading, error } = useQuery(
    trpc.blog.getById.queryOptions({ id: postId })
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen flex-col px-4 sm:max-w-5xl sm:px-8">
          <LandingNavbar />
          <div className="flex-1 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Back button */}
              <div className="mb-8">
                <Link href="/blog">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                  </Button>
                </Link>
              </div>

              {/* Loading skeleton */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="h-12 bg-muted rounded animate-pulse" />
                  <div className="flex gap-4">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen flex-col px-4 sm:max-w-5xl sm:px-8">
          <LandingNavbar />
          <div className="flex-1 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Back button */}
              <div className="mb-8">
                <Link href="/blog">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                  </Button>
                </Link>
              </div>

              {/* Error state */}
              <Card className="text-center py-16">
                <CardContent>
                  <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
                  <p className="text-muted-foreground mb-6">
                    The blog post you're looking for doesn't exist or has been removed.
                  </p>
                  <Link href="/blog">
                    <Button>View All Posts</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Function to render content with images interspersed based on placeholders
  const renderContentWithImages = (): React.ReactNode[] => {
    const images = (post.images || []).filter((img): img is string => Boolean(img));
    let content = post.content;
    
    // Replace image placeholders with actual images - handle both uppercase and lowercase
    images.forEach((imageSrc, index) => {
      if (imageSrc) {
        const placeholderUpper = `{{IMAGE_${index + 1}}}`;
        const placeholderLower = `{{image_${index + 1}}}`;
        const imageElement = `<IMAGE_PLACEHOLDER_${index}>`;
        
        // Replace both uppercase and lowercase versions
        while (content.includes(placeholderUpper)) {
          content = content.replace(placeholderUpper, imageElement);
        }
        while (content.includes(placeholderLower)) {
          content = content.replace(placeholderLower, imageElement);
        }
      }
    });
    
    // Split content by image placeholders and newlines, keeping delimiters
    const parts = content.split(/(<IMAGE_PLACEHOLDER_\d+>)/);
    const result: React.ReactNode[] = [];
    let elementKey = 0;
    
    parts.forEach((part) => {
      if (!part) return;
      
      // Check if it's an image placeholder
      const imageMatch = part.match(/^<IMAGE_PLACEHOLDER_(\d+)>$/);
      if (imageMatch && imageMatch[1]) {
        const imageIndex = parseInt(imageMatch[1]);
        if (imageIndex >= 0 && imageIndex < images.length) {
          const imageSrc = images[imageIndex];
          if (imageSrc) {
            result.push(
              <div key={`image-${elementKey++}`} className="my-8">
                <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={imageSrc}
                    alt={`${post.title} - Image ${imageIndex + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => window.open(imageSrc, '_blank')}
                  />
                </div>
              </div>
            );
          }
        }
      } else if (part.trim()) {
        // Regular text content - split by newlines and create paragraphs
        const paragraphs = part.split('\n').filter(p => p.trim());
        paragraphs.forEach((paragraph) => {
          if (paragraph.trim()) {
            result.push(
              <p key={`paragraph-${elementKey++}`} className="mb-6 leading-relaxed text-lg">
                {paragraph.trim()}
              </p>
            );
          }
        });
      }
    });
    
    // If no placeholders were found or used, fall back to old behavior
    if (result.length === 0 || content === post.content) {
      const paragraphs = post.content.split('\n').filter(p => p.trim());
      
      if (images.length === 0) {
        return paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-6 leading-relaxed text-lg">
            {paragraph}
          </p>
        ));
      }

      // Old auto-distribution behavior as fallback
      let imageIndex = 0;
      const fallbackResult: React.ReactNode[] = [];
      
      paragraphs.forEach((paragraph, index) => {
        fallbackResult.push(
          <p key={`paragraph-${index}`} className="mb-6 leading-relaxed text-lg">
            {paragraph}
          </p>
        );
        
        if ((index + 1) % 3 === 0 && imageIndex < images.length) {
          const imageSrc = images[imageIndex];
          if (imageSrc) {
            fallbackResult.push(
              <div key={`image-${imageIndex}`} className="my-8">
                <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={imageSrc}
                    alt={`${post.title} - Image ${imageIndex + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => window.open(imageSrc, '_blank')}
                  />
                </div>
              </div>
            );
          }
          imageIndex++;
        }
      });
      
      // Add remaining images at the end
      while (imageIndex < images.length) {
        const imageSrc = images[imageIndex];
        if (imageSrc) {
          fallbackResult.push(
            <div key={`image-${imageIndex}`} className="my-8">
              <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={imageSrc}
                  alt={`${post.title} - Image ${imageIndex + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => window.open(imageSrc, '_blank')}
                />
              </div>
            </div>
          );
        }
        imageIndex++;
      }
      
      return fallbackResult;
    }
    
    return result;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen flex-col px-4 sm:max-w-5xl sm:px-8">
        <LandingNavbar />
        <div className="flex-1 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <div className="mb-8">
              <Link href="/blog">
                <Button variant="outline" className="gap-2 hover:bg-accent">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </div>

            {/* Blog post content */}
            <article className="space-y-8">
              {/* Header */}
              <header className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {post.title}
                </h1>
                
                {/* Author and date info */}
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-3">
                    {post.author?.image && (
                      <Image
                        src={post.author.image}
                        alt={post.author.name || "Author"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">
                        {post.author?.name || "Anonymous"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </header>

              {/* Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {renderContentWithImages()}
              </div>

              {/* Footer */}
              <footer className="border-t pt-8 mt-12">
                <div className="flex justify-between items-center">
                  <Link href="/blog">
                    <Button variant="outline" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      More Posts
                    </Button>
                  </Link>
                  
                  {post.author && (
                    <div className="text-sm text-muted-foreground">
                      Written by <span className="font-medium">{post.author.name}</span>
                    </div>
                  )}
                </div>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
} 