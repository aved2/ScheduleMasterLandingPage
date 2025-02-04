import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { events, users, activitySuggestions } from "@db/schema";
import { eq } from "drizzle-orm";
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { searchNearbyPlaces } from "./services/place-suggestions";
import { findFreeTimeSlots } from "@/lib/calendar-utils";

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

      // Get existing suggestions from database
      const dbSuggestions = await db.query.activitySuggestions.findMany({
        where: eq(activitySuggestions.userId, 1),
      });

      // Combine and format all suggestions
      const allSuggestions = [
        ...dbSuggestions,
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

  return httpServer;
}