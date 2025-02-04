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
});

export const activitySuggestions = pgTable("activity_suggestions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  location: text("location"),
  type: text("type").notNull(),
  accepted: boolean("accepted").default(false),
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
