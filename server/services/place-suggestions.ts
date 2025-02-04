import { Client } from "@googlemaps/google-maps-services-js";
import yelp from 'yelp-fusion';
import type { ActivitySuggestion } from "@db/schema";

const googleMapsClient = new Client({});
const yelpClient = yelp.client(process.env.YELP_API_KEY!);

interface Location {
  latitude: number;
  longitude: number;
}

interface PlaceSuggestion {
  title: string;
  description: string;
  duration: number;
  location: string;
  type: string;
  energyLevel: number;
  weatherDependent: boolean;
  indoorActivity: boolean;
}

export async function searchNearbyPlaces(
  location: Location,
  radius: number = 1000,
  activityTypes: string[] = []
): Promise<PlaceSuggestion[]> {
  try {
    // Get suggestions from both APIs
    const [googlePlaces, yelpBusinesses] = await Promise.all([
      searchGooglePlaces(location, radius, activityTypes),
      searchYelpPlaces(location, radius, activityTypes),
    ]);

    // Combine and format results
    const suggestions = [
      ...formatGooglePlaces(googlePlaces),
      ...formatYelpBusinesses(yelpBusinesses),
    ];

    // Deduplicate by title
    const uniqueSuggestions = Array.from(
      new Map(suggestions.map(s => [s.title, s])).values()
    );

    return uniqueSuggestions;
  } catch (error) {
    console.error("Error fetching place suggestions:", error);
    return [];
  }
}

async function searchGooglePlaces(
  location: Location,
  radius: number,
  types: string[]
) {
  const response = await googleMapsClient.placesNearby({
    params: {
      location: [location.latitude, location.longitude],
      radius,
      type: mapActivityTypesToGoogleTypes(types),
      key: process.env.GOOGLE_PLACES_API_KEY!,
    },
  });

  return response.data.results;
}

async function searchYelpPlaces(
  location: Location,
  radius: number,
  categories: string[]
) {
  try {
    const searchRequest = {
      latitude: location.latitude,
      longitude: location.longitude,
      radius,
      categories: mapActivityTypesToYelpCategories(categories),
      limit: 20,
    };

    const response = await yelpClient.search(searchRequest);
    return response.jsonBody.businesses || [];
  } catch (error) {
    console.error('Error fetching from Yelp API:', error);
    return [];
  }
}

function mapActivityTypesToGoogleTypes(types: string[]): string {
  const typeMapping: Record<string, string> = {
    food: "restaurant",
    coffee: "cafe",
    learning: "library",
    outdoors: "park",
    fitness: "gym",
    shopping: "shopping_mall",
  };

  return types.map(t => typeMapping[t] || t)[0] || "point_of_interest";
}

function mapActivityTypesToYelpCategories(types: string[]): string {
  const categoryMapping: Record<string, string> = {
    food: "restaurants",
    coffee: "coffee",
    learning: "education",
    outdoors: "parks",
    fitness: "fitness",
    shopping: "shopping",
  };

  return types.map(t => categoryMapping[t] || t).join(",");
}

function formatGooglePlaces(places: any[]): PlaceSuggestion[] {
  return places.map(place => ({
    title: place.name,
    description: `${place.rating ? `Rating: ${place.rating}/5 - ` : ""}${
      place.vicinity
    }`,
    duration: estimateDuration(place.types[0]),
    location: place.vicinity,
    type: categorizePlace(place.types),
    energyLevel: calculateEnergyLevel(place.types),
    weatherDependent: isWeatherDependent(place.types),
    indoorActivity: !isOutdoorPlace(place.types),
  }));
}

function formatYelpBusinesses(businesses: any[]): PlaceSuggestion[] {
  if (!Array.isArray(businesses)) {
    console.warn('Invalid Yelp response format', businesses);
    return [];
  }

  return businesses.map(business => ({
    title: business.name,
    description: `Rating: ${business.rating}/5 - ${business.location.address1}`,
    duration: estimateDuration(business.categories[0]?.alias),
    location: `${business.location.address1}, ${business.location.city}`,
    type: categorizeBusiness(business.categories),
    energyLevel: calculateEnergyLevelFromCategory(business.categories),
    weatherDependent: isWeatherDependentBusiness(business.categories),
    indoorActivity: !isOutdoorBusiness(business.categories),
  }));
}

function estimateDuration(type: string): number {
  const durationMap: Record<string, number> = {
    restaurant: 60,
    cafe: 30,
    library: 90,
    park: 45,
    gym: 60,
    shopping_mall: 90,
  };
  return durationMap[type] || 60;
}

function categorizePlace(types: string[]): string {
  if (types.includes("restaurant") || types.includes("cafe")) return "food";
  if (types.includes("park") || types.includes("tourist_attraction")) return "outdoors";
  if (types.includes("library") || types.includes("museum")) return "learning";
  if (types.includes("gym")) return "fitness";
  return "leisure";
}

function categorizeBusiness(categories: any[]): string {
  const categoryAliases = categories.map(c => c.alias);
  if (categoryAliases.includes("restaurants")) return "food";
  if (categoryAliases.includes("parks")) return "outdoors";
  if (categoryAliases.includes("education")) return "learning";
  if (categoryAliases.includes("fitness")) return "fitness";
  return "leisure";
}

function calculateEnergyLevel(types: string[]): number {
  if (types.includes("gym") || types.includes("park")) return 4;
  if (types.includes("shopping_mall") || types.includes("museum")) return 3;
  if (types.includes("restaurant")) return 2;
  if (types.includes("library") || types.includes("cafe")) return 1;
  return 2;
}

function calculateEnergyLevelFromCategory(categories: any[]): number {
  const categoryAliases = categories.map(c => c.alias);
  if (categoryAliases.includes("fitness")) return 4;
  if (categoryAliases.includes("shopping")) return 3;
  if (categoryAliases.includes("restaurants")) return 2;
  if (categoryAliases.includes("cafes")) return 1;
  return 2;
}

function isWeatherDependent(types: string[]): boolean {
  return types.some(t =>
    ["park", "tourist_attraction", "amusement_park"].includes(t)
  );
}

function isWeatherDependentBusiness(categories: any[]): boolean {
  return categories.some(c =>
    ["parks", "beaches", "hiking"].includes(c.alias)
  );
}

function isOutdoorPlace(types: string[]): boolean {
  return types.some(t =>
    ["park", "tourist_attraction", "amusement_park"].includes(t)
  );
}

function isOutdoorBusiness(categories: any[]): boolean {
  return categories.some(c =>
    ["parks", "beaches", "hiking"].includes(c.alias)
  );
}