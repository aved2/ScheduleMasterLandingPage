import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { events, users, activitySuggestions, sharedActivities } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { searchNearbyPlaces } from "./services/place-suggestions";
import { findFreeTimeSlots } from "@/lib/calendar-utils";
import { generatePersonalizedSuggestions, analyzeActivityPatterns } from "./services/recommendation-engine";
import { nanoid } from 'nanoid';
import { WebSocket } from "ws";


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Get user's events
  app.get("/api/events", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const userEvents = await db.query.events.findMany({
        where: eq(events.userId, req.user.id),
      });
      res.json(userEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Get user's activity suggestions
  app.get("/api/suggestions", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { lat, lng } = req.query;
      const user = await db.query.users.findFirst({
        where: eq(users.id, req.user.id),
      });

      // Get user's events for today
      const today = new Date();
      const userEvents = await db.query.events.findMany({
        where: eq(events.userId, req.user.id),
      });

      // Find free time slots
      const freeSlots = findFreeTimeSlots(userEvents, today, 30);

      // Get past activity suggestions to learn from
      const pastSuggestions = await db.query.activitySuggestions.findMany({
        where: eq(activitySuggestions.userId, req.user.id),
      });

      // Generate personalized suggestions using ML
      const mlSuggestions = await generatePersonalizedSuggestions(req.user.id, {
        pastActivities: pastSuggestions,
        userPreferences: user?.preferences,
        currentEvents: userEvents,
        location: user?.location,
        timeOfDay: new Date().getHours() < 12 ? 'morning' :
          new Date().getHours() < 17 ? 'afternoon' : 'evening'
      });

      // Get nearby places based on user preferences and free time
      let placeSuggestions: any[] = [];
      if (lat && lng && user?.preferences?.activityTypes) {
        placeSuggestions = await searchNearbyPlaces(
          {
            latitude: Number(lat),
            longitude: Number(lng),
          },
          1000,
          user.preferences.activityTypes
        );

        // Filter suggestions based on available time slots
        placeSuggestions = placeSuggestions.filter(suggestion =>
          freeSlots.some(slot => slot.duration >= suggestion.duration)
        );
      }

      // Combine ML suggestions with place suggestions
      const allSuggestions = [
        ...mlSuggestions,
        ...placeSuggestions.map(place => ({
          id: `place_${place.title}`,
          userId: req.user.id,
          title: place.title,
          description: place.description,
          duration: place.duration,
          location: place.location,
          type: place.type,
          energyLevel: place.energyLevel,
          weatherDependent: place.weatherDependent,
          indoorActivity: place.indoorActivity,
          accepted: false,
        })),
      ];

      // Analyze activity patterns to improve future suggestions
      const patterns = await analyzeActivityPatterns(req.user.id);
      console.log('Activity patterns:', patterns);

      res.json(allSuggestions);
    } catch (error) {
      console.error("Error in /api/suggestions:", error);
      res.status(500).json({ error: "Failed to fetch suggestions" });
    }
  });

  // Get user preferences
  app.get("/api/preferences", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, req.user.id),
      });
      res.json(user?.preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  // Update user preferences
  app.post("/api/preferences", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      await db
        .update(users)
        .set({ preferences: req.body })
        .where(eq(users.id, req.user.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });

  // Accept a suggestion
  app.post("/api/suggestions/:id/accept", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { id } = req.params;
      await db
        .update(activitySuggestions)
        .set({ accepted: true })
        .where(eq(activitySuggestions.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to accept suggestion" });
    }
  });

  // Rate a suggestion
  app.post("/api/suggestions/:id/rate", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { id } = req.params;
      const { rating } = req.body;
      await db
        .update(activitySuggestions)
        .set({ rating })
        .where(eq(activitySuggestions.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to rate suggestion" });
    }
  });

  // Share an activity
  app.post("/api/activities/:id/share", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { id } = req.params;
      const { isPublic } = req.body;

      // Generate a unique share code
      const shareCode = nanoid(10);

      const [updatedActivity] = await db
        .update(activitySuggestions)
        .set({
          isPublic,
          shareCode,
          sharedBy: req.user.id,
          sharedAt: new Date(),
          shareCount: (activity) => activity.shareCount + 1
        })
        .where(eq(activitySuggestions.id, parseInt(id)))
        .returning();

      res.json({
        success: true,
        shareCode,
        shareUrl: `${process.env.APP_URL}/shared/${shareCode}`
      });
    } catch (error) {
      console.error("Error sharing activity:", error);
      res.status(500).json({ error: "Failed to share activity" });
    }
  });

  // Share activity with specific users
  app.post("/api/activities/:id/share-with-users", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { id } = req.params;
      const { userIds } = req.body;

      const shares = await Promise.all(
        userIds.map(async (userId: number) => {
          const [share] = await db.insert(sharedActivities)
            .values({
              activityId: parseInt(id),
              sharedByUserId: req.user.id,
              sharedWithUserId: userId,
              sharedAt: new Date(),
              status: 'pending'
            })
            .returning();
          return share;
        })
      );

      res.json({ success: true, shares });
    } catch (error) {
      console.error("Error sharing activity with users:", error);
      res.status(500).json({ error: "Failed to share activity with users" });
    }
  });

  // Get shared activity by code
  app.get("/api/shared/:shareCode", async (req, res) => {
    try {
      const { shareCode } = req.params;

      const activity = await db.query.activitySuggestions.findFirst({
        where: eq(activitySuggestions.shareCode, shareCode)
      });

      if (!activity) {
        return res.status(404).json({ error: "Shared activity not found" });
      }

      if (!activity.isPublic && !req.user) {
        return res.status(401).json({ error: "Authentication required to view this activity" });
      }

      res.json(activity);
    } catch (error) {
      console.error("Error fetching shared activity:", error);
      res.status(500).json({ error: "Failed to fetch shared activity" });
    }
  });

  // Get activities shared with me
  app.get("/api/shared-with-me", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const sharedActivities = await db.query.sharedActivities.findMany({
        where: eq(sharedActivities.sharedWithUserId, req.user.id),
        orderBy: desc(sharedActivities.sharedAt)
      });

      res.json(sharedActivities);
    } catch (error) {
      console.error("Error fetching shared activities:", error);
      res.status(500).json({ error: "Failed to fetch shared activities" });
    }
  });


  // Create a collaborative event
  app.post("/api/collaborative-events", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { title, description, votingDeadline, category } = req.body;

      // First create the base event
      const [event] = await db.insert(events)
        .values({
          userId: req.user.id,
          title,
          description,
          category,
          isCollaborative: true,
          startTime: new Date(), // Will be updated after voting
          endTime: new Date(), // Will be updated after voting
        })
        .returning();

      // Then create the collaborative event details
      const [collaborativeEvent] = await db.insert(collaborativeEvents)
        .values({
          eventId: event.id,
          createdBy: req.user.id,
          votingDeadline: new Date(votingDeadline),
        })
        .returning();

      // Add creator as first participant
      await db.insert(collaborativeEventParticipants)
        .values({
          collaborativeEventId: collaborativeEvent.id,
          userId: req.user.id,
          role: 'organizer',
          status: 'accepted',
        });

      res.status(201).json({ event, collaborativeEvent });
    } catch (error) {
      console.error("Error creating collaborative event:", error);
      res.status(500).json({ error: "Failed to create collaborative event" });
    }
  });

  // Get collaborative event details
  app.get("/api/collaborative-events/:id", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { id } = req.params;

      const event = await db.query.collaborativeEvents.findFirst({
        where: eq(collaborativeEvents.id, parseInt(id)),
        with: {
          event: true,
          participants: {
            with: {
              user: true,
            },
          },
          timeSlots: true,
          locations: true,
        },
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Check if user is a participant
      const isParticipant = event.participants.some(p => p.user.id === req.user?.id);
      if (!isParticipant) {
        return res.status(403).json({ error: "Not authorized to view this event" });
      }

      res.json(event);
    } catch (error) {
      console.error("Error fetching collaborative event:", error);
      res.status(500).json({ error: "Failed to fetch collaborative event" });
    }
  });

  // Add participant to collaborative event
  app.post("/api/collaborative-events/:id/participants", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const [participant] = await db.insert(collaborativeEventParticipants)
        .values({
          collaborativeEventId: parseInt(id),
          userId,
          role: 'participant',
          status: 'pending',
        })
        .returning();

      res.status(201).json(participant);
    } catch (error) {
      console.error("Error adding participant:", error);
      res.status(500).json({ error: "Failed to add participant" });
    }
  });

  // Propose a time slot
  app.post("/api/collaborative-events/:id/time-slots", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { id } = req.params;
      const { startTime, endTime } = req.body;

      const [timeSlot] = await db.insert(timeSlotProposals)
        .values({
          collaborativeEventId: parseInt(id),
          proposedBy: req.user.id,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        })
        .returning();

      res.status(201).json(timeSlot);
    } catch (error) {
      console.error("Error proposing time slot:", error);
      res.status(500).json({ error: "Failed to propose time slot" });
    }
  });

  // Vote on a time slot
  app.post("/api/time-slots/:id/vote", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { id } = req.params;
      const { preference } = req.body;

      const [vote] = await db.insert(timeSlotVotes)
        .values({
          timeSlotId: parseInt(id),
          userId: req.user.id,
          preference,
        })
        .returning();

      res.status(201).json(vote);
    } catch (error) {
      console.error("Error voting on time slot:", error);
      res.status(500).json({ error: "Failed to vote on time slot" });
    }
  });

  // Propose a location
  app.post("/api/collaborative-events/:id/locations", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { id } = req.params;
      const { location, details } = req.body;

      const [locationProposal] = await db.insert(locationProposals)
        .values({
          collaborativeEventId: parseInt(id),
          proposedBy: req.user.id,
          location,
          details,
        })
        .returning();

      res.status(201).json(locationProposal);
    } catch (error) {
      console.error("Error proposing location:", error);
      res.status(500).json({ error: "Failed to propose location" });
    }
  });

  // Vote on a location
  app.post("/api/locations/:id/vote", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { id } = req.params;
      const { preference } = req.body;

      const [vote] = await db.insert(locationVotes)
        .values({
          locationProposalId: parseInt(id),
          userId: req.user.id,
          preference,
        })
        .returning();

      res.status(201).json(vote);
    } catch (error) {
      console.error("Error voting on location:", error);
      res.status(500).json({ error: "Failed to vote on location" });
    }
  });

  return httpServer;
}