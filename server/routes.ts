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

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Get user's events
  app.get("/api/events", async (req, res) => {
    try {
      const userEvents = await db.query.events.findMany({
        where: eq(events.userId, 1),
      });
      res.json(userEvents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Get user's activity suggestions
  app.get("/api/suggestions", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      const user = await db.query.users.findFirst({
        where: eq(users.id, 1),
      });

      // Get user's events for today
      const today = new Date();
      const userEvents = await db.query.events.findMany({
        where: eq(events.userId, 1),
      });

      // Find free time slots
      const freeSlots = findFreeTimeSlots(userEvents, today, 30);

      // Get past activity suggestions to learn from
      const pastSuggestions = await db.query.activitySuggestions.findMany({
        where: eq(activitySuggestions.userId, 1),
      });

      // Generate personalized suggestions using ML
      const mlSuggestions = await generatePersonalizedSuggestions(1, {
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
          userId: 1,
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
      const patterns = await analyzeActivityPatterns(1);
      console.log('Activity patterns:', patterns);

      res.json(allSuggestions);
    } catch (error) {
      console.error("Error in /api/suggestions:", error);
      res.status(500).json({ error: "Failed to fetch suggestions" });
    }
  });

  // Get user preferences
  app.get("/api/preferences", async (req, res) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, 1),
      });
      res.json(user?.preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  // Update user preferences
  app.post("/api/preferences", async (req, res) => {
    try {
      await db
        .update(users)
        .set({ preferences: req.body })
        .where(eq(users.id, 1));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });

  // Accept a suggestion
  app.post("/api/suggestions/:id/accept", async (req, res) => {
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
          sharedBy: req.session?.userId,
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
    try {
      const { id } = req.params;
      const { userIds } = req.body;

      const shares = await Promise.all(
        userIds.map(async (userId: number) => {
          const [share] = await db.insert(sharedActivities)
            .values({
              activityId: parseInt(id),
              sharedByUserId: req.session?.userId,
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

      if (!activity.isPublic && !req.session?.userId) {
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
    try {
      const sharedActivities = await db.query.sharedActivities.findMany({
        where: eq(sharedActivities.sharedWithUserId, req.session?.userId),
        orderBy: desc(sharedActivities.sharedAt)
      });

      res.json(sharedActivities);
    } catch (error) {
      console.error("Error fetching shared activities:", error);
      res.status(500).json({ error: "Failed to fetch shared activities" });
    }
  });

  return httpServer;
}