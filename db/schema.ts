import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// Existing tables remain unchanged
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
  isCollaborative: boolean("is_collaborative").default(false),
});

// New tables for collaborative events
export const collaborativeEvents = pgTable("collaborative_events", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id),
  createdBy: integer("created_by").references(() => users.id),
  status: text("status").notNull().default('planning'), // planning, confirmed, cancelled
  votingDeadline: timestamp("voting_deadline"),
  finalStartTime: timestamp("final_start_time"),
  finalEndTime: timestamp("final_end_time"),
  finalLocation: text("final_location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const collaborativeEventParticipants = pgTable("collaborative_event_participants", {
  id: serial("id").primaryKey(),
  collaborativeEventId: integer("collaborative_event_id").references(() => collaborativeEvents.id),
  userId: integer("user_id").references(() => users.id),
  role: text("role").notNull().default('participant'), // organizer, participant
  status: text("status").notNull().default('pending'), // pending, accepted, declined
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const timeSlotProposals = pgTable("time_slot_proposals", {
  id: serial("id").primaryKey(),
  collaborativeEventId: integer("collaborative_event_id").references(() => collaborativeEvents.id),
  proposedBy: integer("proposed_by").references(() => users.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const timeSlotVotes = pgTable("time_slot_votes", {
  id: serial("id").primaryKey(),
  timeSlotId: integer("time_slot_id").references(() => timeSlotProposals.id),
  userId: integer("user_id").references(() => users.id),
  preference: integer("preference").notNull(), // 1-5, where 5 is most preferred
  createdAt: timestamp("created_at").defaultNow(),
});

export const locationProposals = pgTable("location_proposals", {
  id: serial("id").primaryKey(),
  collaborativeEventId: integer("collaborative_event_id").references(() => collaborativeEvents.id),
  proposedBy: integer("proposed_by").references(() => users.id),
  location: text("location").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const locationVotes = pgTable("location_votes", {
  id: serial("id").primaryKey(),
  locationProposalId: integer("location_proposal_id").references(() => locationProposals.id),
  userId: integer("user_id").references(() => users.id),
  preference: integer("preference").notNull(), // 1-5, where 5 is most preferred
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const userRelations = relations(users, ({ many }) => ({
  events: many(events),
  suggestions: many(activitySuggestions),
  collaborativeEventsCreated: many(collaborativeEvents, { relationName: "eventsCreated" }),
  collaborativeEventsParticipating: many(collaborativeEventParticipants),
}));

export const eventRelations = relations(events, ({ one, many }) => ({
  user: one(users, { fields: [events.userId], references: [users.id] }),
  collaborativeDetails: one(collaborativeEvents),
}));

export const collaborativeEventRelations = relations(collaborativeEvents, ({ one, many }) => ({
  event: one(events, { fields: [collaborativeEvents.eventId], references: [events.id] }),
  creator: one(users, { fields: [collaborativeEvents.createdBy], references: [users.id] }),
  participants: many(collaborativeEventParticipants),
  timeSlots: many(timeSlotProposals),
  locations: many(locationProposals),
}));

// Export schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertEventSchema = createInsertSchema(events);
export const selectEventSchema = createSelectSchema(events);
export const insertCollaborativeEventSchema = createInsertSchema(collaborativeEvents);
export const selectCollaborativeEventSchema = createSelectSchema(collaborativeEvents);

// Type exports
export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type CollaborativeEvent = typeof collaborativeEvents.$inferSelect;
export type CollaborativeEventParticipant = typeof collaborativeEventParticipants.$inferSelect;
export type TimeSlotProposal = typeof timeSlotProposals.$inferSelect;
export type LocationProposal = typeof locationProposals.$inferSelect;

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

export const userCalendars = pgTable("user_calendars", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  provider: text("provider").notNull(), // google, outlook, apple
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
});

export const insertSuggestionSchema = createInsertSchema(activitySuggestions);
export const selectSuggestionSchema = createSelectSchema(activitySuggestions);

export type ActivitySuggestion = typeof activitySuggestions.$inferSelect;