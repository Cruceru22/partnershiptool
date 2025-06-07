import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@acme/db";
import { blogPost, userAnalysis } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const blogRouter = {
  // Get all published blog posts (public)
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.query.blogPost.findMany({
      where: eq(blogPost.published, true),
      orderBy: [desc(blogPost.createdAt)],
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return posts;
  }),

  // Get a single blog post by ID (public)
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.blogPost.findFirst({
        where: eq(blogPost.id, input.id),
        with: {
          author: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!post) {
        throw new Error("Blog post not found");
      }

      // Only return published posts to public, unless user is Nick
      if (!post.published) {
        // Check if user is authenticated and is Nick
        const user = ctx.session?.user;
        if (user) {
          const userAnalysisRecord = await ctx.db.query.userAnalysis.findFirst({
            where: eq(userAnalysis.userId, user.id),
          });
          
          if (!userAnalysisRecord?.isNick) {
            throw new Error("Blog post not found");
          }
        } else {
          throw new Error("Blog post not found");
        }
      }

      return post;
    }),

  // Debug endpoint to get all posts (remove this after testing)
  debug: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.query.blogPost.findMany({
      orderBy: [desc(blogPost.createdAt)],
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    console.log("Debug: Found posts:", posts.length);
    console.log("Debug: Posts data:", JSON.stringify(posts, null, 2));
    return posts;
  }),

  // Get all blog posts including drafts (for Nick only)
  getAllForNick: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is Nick
    const userAnalysisRecord = await ctx.db.query.userAnalysis.findFirst({
      where: eq(userAnalysis.userId, ctx.session.user.id),
    });

    if (!userAnalysisRecord?.isNick) {
      throw new Error("Unauthorized: Only Nick can access all posts");
    }

    const posts = await ctx.db.query.blogPost.findMany({
      orderBy: [desc(blogPost.createdAt)],
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return posts;
  }),

  // Create a new blog post (Nick only)
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        images: z.array(z.string().url()).optional(),
        published: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is Nick
      const userAnalysisRecord = await ctx.db.query.userAnalysis.findFirst({
        where: eq(userAnalysis.userId, ctx.session.user.id),
      });

      if (!userAnalysisRecord?.isNick) {
        throw new Error("Unauthorized: Only Nick can create blog posts");
      }

      const newPost = await ctx.db
        .insert(blogPost)
        .values({
          id: crypto.randomUUID(),
          title: input.title,
          content: input.content,
          images: input.images || [],
          authorId: ctx.session.user.id,
          published: input.published,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return newPost[0];
    }),

  // Update a blog post (Nick only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(255).optional(),
        content: z.string().min(1).optional(),
        images: z.array(z.string().url()).optional(),
        published: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is Nick
      const userAnalysisRecord = await ctx.db.query.userAnalysis.findFirst({
        where: eq(userAnalysis.userId, ctx.session.user.id),
      });

      if (!userAnalysisRecord?.isNick) {
        throw new Error("Unauthorized: Only Nick can update blog posts");
      }

      const updatedPost = await ctx.db
        .update(blogPost)
        .set({
          ...(input.title && { title: input.title }),
          ...(input.content && { content: input.content }),
          ...(input.images && { images: input.images }),
          ...(input.published !== undefined && { published: input.published }),
          updatedAt: new Date(),
        })
        .where(eq(blogPost.id, input.id))
        .returning();

      return updatedPost[0];
    }),

  // Delete a blog post (Nick only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is Nick
      const userAnalysisRecord = await ctx.db.query.userAnalysis.findFirst({
        where: eq(userAnalysis.userId, ctx.session.user.id),
      });

      if (!userAnalysisRecord?.isNick) {
        throw new Error("Unauthorized: Only Nick can delete blog posts");
      }

      await ctx.db.delete(blogPost).where(eq(blogPost.id, input.id));
      return { success: true };
    }),

  // Check if current user is Nick
  isNick: protectedProcedure.query(async ({ ctx }) => {
    const userAnalysisRecord = await ctx.db.query.userAnalysis.findFirst({
      where: eq(userAnalysis.userId, ctx.session.user.id),
    });

    return { isNick: userAnalysisRecord?.isNick ?? false };
  }),
} satisfies TRPCRouterRecord; 