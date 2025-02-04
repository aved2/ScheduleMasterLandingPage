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
    // Prepare the prompt with user context
    const prompt = {
      role: "system",
      content: `You are an AI activity recommendation engine. Based on the following context, suggest 3 personalized activities:
      Past Activities: ${JSON.stringify(context.pastActivities)}
      User Preferences: ${JSON.stringify(context.userPreferences)}
      Current Events: ${JSON.stringify(context.currentEvents)}
      Location: ${context.location || 'Unknown'}
      Time of Day: ${context.timeOfDay}

      Generate suggestions in JSON format with the following structure:
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
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt.content }
      ],
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
  const activities = await db.query.activitySuggestions.findMany({
    where: eq(activitySuggestions.userId, userId)
  });

  // Analyze patterns in accepted and highly-rated activities
  const acceptedActivities = activities.filter(a => a.accepted);
  const highlyRatedActivities = activities.filter(a => (a.rating || 0) >= 4);

  const analysis = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Analyze these activities and provide insights in JSON format:
        {
          "preferredTimes": ["morning", "afternoon"],
          "popularLocations": ["park", "cafe"],
          "energyLevelTrends": {"morning": 4, "afternoon": 3, "evening": 2}
        }

        Input data:
        Accepted Activities: ${JSON.stringify(acceptedActivities)}
        Highly Rated Activities: ${JSON.stringify(highlyRatedActivities)}`
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(analysis.choices[0].message.content);
}