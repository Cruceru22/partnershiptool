"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, ImageIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Textarea } from "@acme/ui/textarea";
import { toast } from "@acme/ui/toast";

import { UploadDropzone } from "~/utils/uploadthing";
import { useTRPC } from "~/trpc/react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  images?: string[] | null;
  createdAt: Date;
  published: boolean;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

export function BlogSection() {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: posts = [] } = useQuery(trpc.blog.getAll.queryOptions());
  const { data: nickStatus } = useQuery(trpc.blog.isNick.queryOptions());
  const isNick = nickStatus?.isNick ?? false;

  // Handle upload messages with useEffect to avoid render-time toast calls
  useEffect(() => {
    if (uploadMessage) {
      if (uploadMessage.type === 'success') {
        toast.success(uploadMessage.message);
      } else {
        toast.error(uploadMessage.message);
      }
      setUploadMessage(null);
    }
  }, [uploadMessage]);

  const createPost = useMutation(
    trpc.blog.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.blog.getAll.pathFilter());
        setIsCreating(false);
        setTitle("");
        setContent("");
        setImages([]);
        // Toast will be called after successful mutation
      },
      onError: (error) => {
        // Toast will be called after failed mutation
        console.error("Failed to publish blog post:", error.message);
      },
    }),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      createPost.mutate({
        title: title.trim(),
        content: content.trim(),
        images: images.length > 0 ? images : undefined,
        published: true,
      }, {
        onSuccess: () => {
          toast.success("Blog post published successfully!");
        },
        onError: (error) => {
          toast.error("Failed to publish blog post: " + error.message);
        },
      });
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const resetForm = () => {
    setIsCreating(false);
    setTitle("");
    setContent("");
    setImages([]);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Partnership Tool Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest insights, tips, and updates from our team.
            </p>
          </div>

          {/* Create Post Section */}
          {isNick && (
            <Card className="shadow-lg border-0 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Share Your Thoughts</CardTitle>
                  <Button
                    onClick={() => setIsCreating(!isCreating)}
                    variant={isCreating ? "outline" : "primary"}
                    className="min-w-[120px]"
                  >
                    {isCreating ? "Cancel" : "New Post"}
                  </Button>
                </div>
              </CardHeader>

              {isCreating && (
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="Enter an engaging title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content</label>
                      <Textarea
                        placeholder="Share your thoughts and insights..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                        required
                        className="resize-none"
                      />
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-blue-600" />
                        <label className="text-sm font-medium">Add Images</label>
                      </div>

                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res) {
                            const newUrls = res.map((file) => file.url);
                            setImages([...images, ...newUrls]);
                            setUploadMessage({ type: 'success', message: "Images uploaded successfully!" });
                          }
                        }}
                        onUploadError={(error: Error) => {
                          setUploadMessage({ type: 'error', message: `Upload failed: ${error.message}` });
                        }}
                        className="border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50"
                      />

                      {/* Image Preview */}
                      {images.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {images.length} image{images.length !== 1 ? 's' : ''} uploaded
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map((img, index) => (
                              <div key={index} className="relative group">
                                <div className="relative h-24 w-full rounded-lg overflow-hidden bg-muted">
                                  <Image
                                    src={img}
                                    alt={`Upload ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  size="sm"
                                  variant="destructive"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={createPost.isPending || !title.trim() || !content.trim()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {createPost.isPending ? "Publishing..." : "Publish Post"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        disabled={createPost.isPending}
                      >
                        Clear
                      </Button>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>
          )}

          {/* Blog Posts */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardContent className="text-center py-16">
                  <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
                  <p className="text-muted-foreground">
                    {isNick ? "Be the first to share your thoughts!" : "Check back soon for new content."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post: BlogPost) => (
                <Card key={post.id} className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold leading-tight">{post.title}</CardTitle>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {post.author?.image && (
                          <Image
                            src={post.author.image}
                            alt={post.author.name || "Author"}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span>By {post.author?.name || "Anonymous"}</span>
                      </div>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      {post.content.split('\n').map((paragraph: string, index: number) => (
                        paragraph.trim() && (
                          <p key={index} className="mb-4 leading-relaxed">
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>

                    {/* Display Images */}
                    {post.images && post.images.length > 0 && (
                      <div className="space-y-4">
                        <div className="border-t pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {post.images.map((img, index) => (
                              <div key={index} className="relative group">
                                <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted">
                                  <Image
                                    src={img}
                                    alt={`${post.title} image ${index + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform cursor-pointer"
                                    onClick={() => window.open(img, '_blank')}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 