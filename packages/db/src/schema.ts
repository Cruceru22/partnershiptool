import { relations, sql } from "drizzle-orm";
import { pgTable, unique } from "drizzle-orm/pg-core";

import { organization, user } from "./auth-schema";

export const Video = pgTable("video", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 256 }).notNull(),
  description: t.text(),

  url: t.text(),

  organizationId: t
    .text("organization_id")
    .notNull()
    .references(() => organization.id),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => new Date()),
}));

export const VideoComment = pgTable("video_comment", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),

  content: t.text(),

  startTime: t.real().notNull(),
  endTime: t.real(),

  attachments: t.json(),
  metadata: t.json(),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),

  videoId: t
    .uuid("video_id")
    .notNull()
    .references(() => Video.id, {
      onDelete: "cascade",
    }),

  reviewerId: t.uuid("reviewer_id").references(() => Reviewers.id),
}));

export const Reviewers = pgTable(
  "reviewers",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),

    anonUserId: t.text("anon_user_id"),
    userId: t.text("user_id").references(() => user.id),

    videoId: t
      .uuid("video_id")
      .notNull()
      .references(() => Video.id),
  }),
  (t) => [unique().on(t.videoId, t.userId, t.anonUserId).nullsNotDistinct()],
);

export const videoCommentRelations = relations(VideoComment, ({ one }) => ({
  video: one(Video, {
    fields: [VideoComment.videoId],
    references: [Video.id],
  }),
  reviewer: one(Reviewers, {
    fields: [VideoComment.reviewerId],
    references: [Reviewers.id],
  }),
}));

export const reviewerRelations = relations(Reviewers, ({ many, one }) => ({
  comments: many(VideoComment),
  user: one(user, {
    fields: [Reviewers.userId],
    references: [user.id],
  }),
}));

export * from "./auth-schema";
