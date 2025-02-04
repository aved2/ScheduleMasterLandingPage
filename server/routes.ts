import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { events, users, activitySuggestions } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Get user's events
  app.get("/api/events", async (req, res) => {
    try {
      const userEvents = await db.query.events.findMany({
        where: eq(events.userId, 1), // TODO: Replace with actual user ID from session
      });
      res.json(userEvents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Get user's activity suggestions
  app.get("/api/suggestions", async (req, res) => {
    try {
      const suggestions = await db.query.activitySuggestions.findMany({
        where: eq(activitySuggestions.userId, 1), // TODO: Replace with actual user ID
      });
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suggestions" });
    }
  });

  // Get user preferences
  app.get("/api/preferences", async (req, res) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, 1), // TODO: Replace with actual user ID
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
        .where(eq(users.id, 1)); // TODO: Replace with actual user ID
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });

  // Accept suggestion
  app.post("/api/suggestions/:id/accept", async (req, res) => {
    try {
      await db
        .update(activitySuggestions)
        .set({ accepted: true })
        .where(eq(activitySuggestions.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to accept suggestion" });
    }
  });

  // Decline suggestion
  app.post("/api/suggestions/:id/decline", async (req, res) => {
    try {
      await db
        .delete(activitySuggestions)
        .where(eq(activitySuggestions.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to decline suggestion" });
    }
  });

  return httpServer;
}
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

// Calendar integration endpoints
app.post('/api/calendars/google/connect', async (req, res) => {
  const { code } = req.body;
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    // Store tokens in user record
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect calendar' });
  }
});

app.get('/api/events/sync', async (req, res) => {
  try {
    // Sync logic for connected calendars
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync events' });
  }
});
