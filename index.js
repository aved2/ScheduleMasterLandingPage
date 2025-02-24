var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { OAuth2Client } from "google-auth-library";
var CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
var REDIRECT_URI = process.env.REDIRECT_URI;
var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
function registerRoutes(app2) {
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  base: "/ScheduleMasterLandingPage/",
  plugins: [react(), runtimeErrorOverlay(), themePlugin()],
  resolve: {
    alias: {
      "@db": path.resolve(__dirname, "db"),
      "@": path.resolve(__dirname, "client", "src")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: {
      middlewareMode: true,
      hmr: { server }
    },
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`);
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activitySuggestions: () => activitySuggestions,
  collaborativeEventParticipants: () => collaborativeEventParticipants,
  collaborativeEventRelations: () => collaborativeEventRelations,
  collaborativeEvents: () => collaborativeEvents,
  eventRelations: () => eventRelations,
  events: () => events,
  insertCollaborativeEventSchema: () => insertCollaborativeEventSchema,
  insertEventSchema: () => insertEventSchema,
  insertSuggestionSchema: () => insertSuggestionSchema,
  insertUserConnectionSchema: () => insertUserConnectionSchema,
  insertUserSchema: () => insertUserSchema,
  locationProposals: () => locationProposals,
  locationVotes: () => locationVotes,
  selectCollaborativeEventSchema: () => selectCollaborativeEventSchema,
  selectEventSchema: () => selectEventSchema,
  selectSuggestionSchema: () => selectSuggestionSchema,
  selectUserConnectionSchema: () => selectUserConnectionSchema,
  selectUserSchema: () => selectUserSchema,
  sharedActivities: () => sharedActivities,
  timeSlotProposals: () => timeSlotProposals,
  timeSlotVotes: () => timeSlotVotes,
  userCalendars: () => userCalendars,
  userConnectionRelations: () => userConnectionRelations,
  userConnections: () => userConnections,
  userRelations: () => userRelations,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  location: text("location"),
  preferences: jsonb("preferences").$type()
});
var events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"),
  category: text("category").notNull().default("personal"),
  source: text("source"),
  // google, outlook, apple, manual
  externalId: text("external_id"),
  rating: integer("rating"),
  price: integer("price"),
  isCollaborative: boolean("is_collaborative").default(false)
});
var collaborativeEvents = pgTable("collaborative_events", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id),
  createdBy: integer("created_by").references(() => users.id),
  status: text("status").notNull().default("planning"),
  // planning, confirmed, cancelled
  votingDeadline: timestamp("voting_deadline"),
  finalStartTime: timestamp("final_start_time"),
  finalEndTime: timestamp("final_end_time"),
  finalLocation: text("final_location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var collaborativeEventParticipants = pgTable("collaborative_event_participants", {
  id: serial("id").primaryKey(),
  collaborativeEventId: integer("collaborative_event_id").references(() => collaborativeEvents.id),
  userId: integer("user_id").references(() => users.id),
  role: text("role").notNull().default("participant"),
  // organizer, participant
  status: text("status").notNull().default("pending"),
  // pending, accepted, declined
  joinedAt: timestamp("joined_at").defaultNow()
});
var timeSlotProposals = pgTable("time_slot_proposals", {
  id: serial("id").primaryKey(),
  collaborativeEventId: integer("collaborative_event_id").references(() => collaborativeEvents.id),
  proposedBy: integer("proposed_by").references(() => users.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var timeSlotVotes = pgTable("time_slot_votes", {
  id: serial("id").primaryKey(),
  timeSlotId: integer("time_slot_id").references(() => timeSlotProposals.id),
  userId: integer("user_id").references(() => users.id),
  preference: integer("preference").notNull(),
  // 1-5, where 5 is most preferred
  createdAt: timestamp("created_at").defaultNow()
});
var locationProposals = pgTable("location_proposals", {
  id: serial("id").primaryKey(),
  collaborativeEventId: integer("collaborative_event_id").references(() => collaborativeEvents.id),
  proposedBy: integer("proposed_by").references(() => users.id),
  location: text("location").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow()
});
var locationVotes = pgTable("location_votes", {
  id: serial("id").primaryKey(),
  locationProposalId: integer("location_proposal_id").references(() => locationProposals.id),
  userId: integer("user_id").references(() => users.id),
  preference: integer("preference").notNull(),
  // 1-5, where 5 is most preferred
  createdAt: timestamp("created_at").defaultNow()
});
var userConnections = pgTable("user_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  connectedUserId: integer("connected_user_id").references(() => users.id),
  status: text("status").notNull().default("pending"),
  // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var userRelations = relations(users, ({ many }) => ({
  events: many(events),
  suggestions: many(activitySuggestions),
  collaborativeEventsCreated: many(collaborativeEvents, { relationName: "eventsCreated" }),
  collaborativeEventsParticipating: many(collaborativeEventParticipants),
  // Fix the relations syntax for user connections
  sentConnections: many(userConnections),
  receivedConnections: many(userConnections)
}));
var eventRelations = relations(events, ({ one, many }) => ({
  user: one(users, { fields: [events.userId], references: [users.id] }),
  collaborativeDetails: one(collaborativeEvents)
}));
var collaborativeEventRelations = relations(collaborativeEvents, ({ one, many }) => ({
  event: one(events, { fields: [collaborativeEvents.eventId], references: [events.id] }),
  creator: one(users, { fields: [collaborativeEvents.createdBy], references: [users.id] }),
  participants: many(collaborativeEventParticipants),
  timeSlots: many(timeSlotProposals),
  locations: many(locationProposals)
}));
var userConnectionRelations = relations(userConnections, ({ one }) => ({
  user: one(users, { fields: [userConnections.userId], references: [users.id] }),
  connectedUser: one(users, { fields: [userConnections.connectedUserId], references: [users.id] })
}));
var insertUserSchema = createInsertSchema(users);
var selectUserSchema = createSelectSchema(users);
var insertEventSchema = createInsertSchema(events);
var selectEventSchema = createSelectSchema(events);
var insertCollaborativeEventSchema = createInsertSchema(collaborativeEvents);
var selectCollaborativeEventSchema = createSelectSchema(collaborativeEvents);
var insertUserConnectionSchema = createInsertSchema(userConnections);
var selectUserConnectionSchema = createSelectSchema(userConnections);
var activitySuggestions = pgTable("activity_suggestions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(),
  // in minutes
  location: text("location"),
  type: text("type").notNull(),
  // relaxing, active, social, educational
  energyLevel: integer("energy_level").notNull(),
  // 1-5
  weatherDependent: boolean("weather_dependent").default(false),
  indoorActivity: boolean("indoor_activity").default(true),
  accepted: boolean("accepted").default(false),
  rating: integer("rating"),
  // User feedback 1-5
  isPublic: boolean("is_public").default(false),
  // New field for sharing
  shareCode: text("share_code"),
  // New field for unique sharing link
  sharedBy: text("shared_by"),
  // New field to track who shared it
  sharedAt: timestamp("shared_at"),
  // New field to track when it was shared
  shareCount: integer("share_count").default(0)
  // New field to track number of shares
});
var sharedActivities = pgTable("shared_activities", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id").references(() => activitySuggestions.id),
  sharedByUserId: integer("shared_by_user_id").references(() => users.id),
  sharedWithUserId: integer("shared_with_user_id").references(() => users.id),
  sharedAt: timestamp("shared_at").notNull(),
  status: text("status").notNull()
  // pending, accepted, declined
});
var userCalendars = pgTable("user_calendars", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  provider: text("provider").notNull(),
  // google, outlook, apple
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at")
});
var insertSuggestionSchema = createInsertSchema(activitySuggestions);
var selectSuggestionSchema = createSelectSchema(activitySuggestions);

// db/index.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import "dotenv/config";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/auth.ts
import { eq } from "drizzle-orm";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
var userSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  location: z.string().optional(),
  preferences: z.object({
    dietaryRestrictions: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    activityTypes: z.array(z.string()).optional()
  }).optional()
});
var scryptAsync = promisify(scrypt);
var PostgresSessionStore = connectPg(session);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
async function getUserByUsername(username) {
  return db.select().from(users).where(eq(users.username, username)).limit(1);
}
function setupAuth(app2) {
  const store = new PostgresSessionStore({ pool, createTableIfMissing: true });
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      secure: app2.get("env") === "production",
      maxAge: 24 * 60 * 60 * 1e3
      // 24 hours
    }
  };
  if (app2.get("env") === "production") {
    app2.set("trust proxy", 1);
  }
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const [user] = await getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  app2.post("/api/register", async (req, res) => {
    try {
      const result = userSchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ error: error.message });
      }
      const { username, password, location, preferences } = result.data;
      const [existingUser] = await getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const hashedPassword = await hashPassword(password);
      const [user] = await db.insert(users).values({
        username,
        password: hashedPassword,
        location,
        preferences
      }).returning();
      req.login(user, (err) => {
        if (err) {
          console.error("Login error after registration:", err);
          return res.status(500).json({ error: "Error logging in after registration" });
        }
        return res.status(201).json(user);
      });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ error: "Internal server error during registration" });
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: info?.message || "Authentication failed" });
      }
      req.login(user, (err2) => {
        if (err2) return next(err2);
        res.json(user);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
setupAuth(app);
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = registerRoutes(app);
  app.use((err, _req, res, _next) => {
    console.error("Error:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ error: message });
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const PORT = 5051;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();
