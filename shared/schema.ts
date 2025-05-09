import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
  isPremium: boolean("is_premium").default(false),
  subscriptionType: text("subscription_type"),
  subscriptionExpiry: timestamp("subscription_expiry"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content table for all media
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "video" or "photo"
  accessLevel: text("access_level").notNull(), // "free" or "premium"
  thumbnailUrl: text("thumbnail_url").notNull(),
  contentUrl: text("content_url").notNull(),
  duration: text("duration"), // for videos
  views: integer("views").default(0),
  categories: jsonb("categories").$type<string[]>().default([]),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: integer("parent_id").references(() => categories.id),
});

// Subscription plans table
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  interval: text("interval").notNull(), // "monthly", "annually", "lifetime"
  features: jsonb("features").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
});

// User favorites
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  contentId: integer("content_id").references(() => content.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insertion schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true,
  isPremium: true,
  subscriptionType: true,
  subscriptionExpiry: true,
});

export const insertContentSchema = createInsertSchema(content).pick({
  title: true,
  description: true,
  type: true,
  accessLevel: true,
  thumbnailUrl: true,
  contentUrl: true,
  duration: true,
  categories: true,
  isPublished: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  description: true,
  parentId: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).pick({
  name: true,
  description: true,
  price: true,
  interval: true,
  features: true,
  isActive: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  contentId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
