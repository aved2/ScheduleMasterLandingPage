import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { events, users, activitySuggestions } from "@db/schema";
import { eq } from "drizzle-orm";
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
// Add necessary imports for Yelp and Google Places APIs here.  e.g.,  const yelp = require('yelp-fusion');


const CLIENT_ID = '505387694243-rqk2uo1mfta52pdskhOg8llieg6rkNhb.apps.googleusercontent.com';
const CLIENT_SECRET = 'GOCSPX-wY-6eXzPu3Pf6uW5nSWr4LZWSFY';
const REDIRECT_URI = 'https://workspace.arkhthareddy.repl.co/oauth2callback';

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Add your Yelp API key here securely (e.g., using environment variables or Secrets).
const YELP_API_KEY = process.env.YELP_API_KEY;

// Add your Google Places API key here securely (e.g., using environment variables or Secrets).
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;


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

      const dbSuggestions = await db.query.activitySuggestions.findMany({
        where: eq(activitySuggestions.userId, 1),
      });

      let externalSuggestions = [];
      if (lat && lng) {
        const activityTypes = user?.preferences?.activityTypes || [];
        const places = await Promise.all(
          activityTypes.map(type => 
            searchNearbyPlaces(Number(lat), Number(lng), type)
          )
        );
        externalSuggestions = places.flat();
      }

      res.json([...dbSuggestions, ...externalSuggestions]);
    } catch (error) {
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

  // Calendar integration endpoints
  app.post('/api/calendars/google/connect', async (req, res) => {
    const { code } = req.body;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to connect calendar' });
    }
  });

  app.get('/auth/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    });
    res.redirect(authUrl);
  });

  app.get('/oauth2callback', async (req, res) => {
    try {
      const { code } = req.query;
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);
      res.redirect('/home');
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed' });
    }
  });

  return httpServer;
}


// Placeholder function - Replace with actual implementation using Yelp and Google Places APIs
async function searchNearbyPlaces(lat: number, lng: number, activityType: string): Promise<any[]> {
  // Implement API calls to Yelp and Google Places here.  This will require API keys and client libraries for both APIs.
  // Example (replace with actual API calls):
  // const yelpResponse = await yelp.search({ ... });
  // const googleResponse = await googlePlacesClient.placesNearby({ ... });
  // return [...yelpResponse.businesses, ...googleResponse.results];
  return []; //Return empty array for now.
}