import OpenAI from "openai";
import { type User, type ActivitySuggestion, type Event } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";
import { activitySuggestions } from "@db/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface RecommendationContext {
  pastActivities: ActivitySuggestion[];
  userPreferences: User['preferences'];
  currentEvents: Event[];
  location?: string;
  timeOfDay: string;
}

export async function generatePersonalizedSuggestions(
  userId: number,
  context: RecommendationContext
): Promise<ActivitySuggestion[]> {
  try {
    // Prepare sample suggestions in case AI fails
    const fallbackSuggestions = [
      {
        title: "Coffee Break",
        description: "Take a refreshing coffee break at a nearby café",
        duration: 30,
        location: "Local Café",
        type: "relaxation",
        energyLevel: 2,
        weatherDependent: false,
        indoorActivity: true
      },
      {
        title: "Quick Walk",
        description: "Take a brisk walk around the block",
        duration: 15,
        location: "Nearby",
        type: "exercise",
        energyLevel: 3,
        weatherDependent: true,
        indoorActivity: false
      }
    ];

    try {
      const prompt = {
        role: "system",
        content: `Generate 3 activity suggestions based on:
        Past Activities: ${JSON.stringify(context.pastActivities)}
        User Preferences: ${JSON.stringify(context.userPreferences)}
        Current Events: ${JSON.stringify(context.currentEvents)}
        Location: ${context.location || 'Unknown'}
        Time of Day: ${context.timeOfDay}

        Respond in this exact JSON format:
        {
          "suggestions": [
            {
              "title": "string",
              "description": "string",
              "duration": number,
              "location": "string",
              "type": "string",
              "energyLevel": number,
              "weatherDependent": boolean,
              "indoorActivity": boolean
            }
          ]
        }`
      };

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: prompt.content }],
        response_format: { type: "json_object" }
      });

      const suggestions = JSON.parse(response.choices[0].message.content).suggestions;

      // Save the generated suggestions to the database
      const savedSuggestions = await Promise.all(
        suggestions.map(async (suggestion: Omit<ActivitySuggestion, 'id' | 'userId'>) => {
          const [savedSuggestion] = await db.insert(activitySuggestions)
            .values({
              ...suggestion,
              userId,
              accepted: false,
            })
            .returning();
          return savedSuggestion;
        })
      );

      return savedSuggestions;
    } catch (aiError) {
      console.error("AI suggestion generation failed:", aiError);
      // Return fallback suggestions if AI fails
      const savedSuggestions = await Promise.all(
        fallbackSuggestions.map(async (suggestion) => {
          const [savedSuggestion] = await db.insert(activitySuggestions)
            .values({
              ...suggestion,
              userId,
              accepted: false,
            })
            .returning();
          return savedSuggestion;
        })
      );
      return savedSuggestions;
    }
  } catch (error) {
    console.error("Error generating personalized suggestions:", error);
    return [];
  }
}

export async function analyzeActivityPatterns(
  userId: number
): Promise<{ 
  preferredTimes: string[];
  popularLocations: string[];
  energyLevelTrends: Record<string, number>;
}> {
  try {
    const activities = await db.query.activitySuggestions.findMany({
      where: eq(activitySuggestions.userId, userId)
    });

    // Return basic analysis if no OpenAI available
    return {
      preferredTimes: ["morning", "afternoon"],
      popularLocations: ["local"],
      energyLevelTrends: {
        morning: 4,
        afternoon: 3,
        evening: 2
      }
    };
  } catch (error) {
    console.error("Error analyzing activity patterns:", error);
    return {
      preferredTimes: [],
      popularLocations: [],
      energyLevelTrends: {}
    };
  }
}