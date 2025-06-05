import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  uniqueIndex,
  boolean,
} from "drizzle-orm/pg-core";

import { organization, user } from "./auth-schema";



export const charts = pgTable(
  "charts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    options: json("options").notNull(),
    data: json("data").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`now()`)
      .notNull(),
    createdById: text("created_by_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    workspaceId: text("workspace_id")
      .references(() => organization.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    createdByIndex: index("charts_created_by_idx").on(table.createdById),
    workspaceIndex: index("charts_workspace_idx").on(table.workspaceId),
    titleIndex: index("charts_title_idx").on(table.title),
  }),
);

export const awinTransactions = pgTable(
  "awin_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    transactionId: integer("transaction_id").notNull(),
    advertiserId: integer("advertiser_id").notNull(),
    publisherId: integer("publisher_id").notNull(),
    siteName: varchar("site_name", { length: 256 }).notNull(),
    commissionStatus: varchar("commission_status", { length: 50 }).notNull(),
    commissionAmount: json("commission_amount").notNull(),
    saleAmount: json("sale_amount").notNull(),
    customerCountry: varchar("customer_country", { length: 2 }),
    clickDate: timestamp("click_date").notNull(),
    transactionDate: timestamp("transaction_date").notNull(),
    validationDate: timestamp("validation_date").notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    voucherCodeUsed: boolean("voucher_code_used").notNull(),
    voucherCode: varchar("voucher_code", { length: 50 }),
    clickDevice: varchar("click_device", { length: 50 }).notNull(),
    transactionDevice: varchar("transaction_device", { length: 50 }).notNull(),
    customerAcquisition: varchar("customer_acquisition", { length: 50 }).notNull(),
    publisherUrl: text("publisher_url").notNull(),
    orderRef: varchar("order_ref", { length: 256 }).notNull(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    month: varchar("month", { length: 7 }).notNull(), // Format: YYYY-MM
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIndex: index("awin_transactions_org_idx").on(table.organizationId),
    monthIndex: index("awin_transactions_month_idx").on(table.month),
    transactionIdOrgIdIndex: uniqueIndex("awin_transactions_txn_org_idx").on(
      table.transactionId,
      table.organizationId,
    ),
  }),
);

export const stripeTransactions = pgTable(
  "stripe_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    stripeSessionId: text("stripe_session_id").notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    status: varchar("status", { length: 50 }).notNull(), // 'succeeded', 'failed', etc
    planType: varchar("plan_type", { length: 50 }).notNull(),
    isAnnual: boolean("is_annual").notNull(),
    metadata: json("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIndex: index("stripe_transactions_user_idx").on(table.userId),
    stripeSessionIdIndex: uniqueIndex("stripe_transactions_session_idx").on(table.stripeSessionId),
  }),
);

export const userAnalysis = pgTable("user_analysis", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  isNick: boolean("is_nick").notNull().default(false),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const blogPost = pgTable("blog_post", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  images: text("images").array(),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  published: boolean("published").notNull().default(false),
});

// Relations
export const blogPostRelations = relations(blogPost, ({ one }) => ({
  author: one(user, {
    fields: [blogPost.authorId],
    references: [user.id],
  }),
}));

export const userAnalysisRelations = relations(userAnalysis, ({ one }) => ({
  user: one(user, {
    fields: [userAnalysis.userId],
    references: [user.id],
  }),
}));


export * from "./auth-schema";
