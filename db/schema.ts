import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  location: text("location"),
  preferences: jsonb("preferences").$type<{
    dietaryRestrictions: string[];
    interests: string[];
    activityTypes: string[];
  }>(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"),
  category: text("category").notNull().default('personal'),
  source: text("source"), // google, outlook, apple, manual
  externalId: text("external_id"),
  rating: integer("rating"),
  price: integer("price"),
});

export const userCalendars = pgTable("user_calendars", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  provider: text("provider").notNull(), // google, outlook, apple
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
});

export const activitySuggestions = pgTable("activity_suggestions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  location: text("location"),
  type: text("type").notNull(), // relaxing, active, social, educational
  energyLevel: integer("energy_level").notNull(), // 1-5
  weatherDependent: boolean("weather_dependent").default(false),
  indoorActivity: boolean("indoor_activity").default(true),
  accepted: boolean("accepted").default(false),
  rating: integer("rating"), // User feedback 1-5
  isPublic: boolean("is_public").default(false), // New field for sharing
  shareCode: text("share_code"), // New field for unique sharing link
  sharedBy: text("shared_by"), // New field to track who shared it
  sharedAt: timestamp("shared_at"), // New field to track when it was shared
  shareCount: integer("share_count").default(0), // New field to track number of shares
});

export const sharedActivities = pgTable("shared_activities", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id").references(() => activitySuggestions.id),
  sharedByUserId: integer("shared_by_user_id").references(() => users.id),
  sharedWithUserId: integer("shared_with_user_id").references(() => users.id),
  sharedAt: timestamp("shared_at").notNull(),
  status: text("status").notNull(), // pending, accepted, declined
});

export const userRelations = relations(users, ({ many }) => ({
  events: many(events),
  suggestions: many(activitySuggestions),
}));

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertEventSchema = createInsertSchema(events);
export const selectEventSchema = createSelectSchema(events);
export const insertSuggestionSchema = createInsertSchema(activitySuggestions);
export const selectSuggestionSchema = createSelectSchema(activitySuggestions);

export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type ActivitySuggestion = typeof activitySuggestions.$inferSelect;