import yelp from 'yelp-fusion';

const client = yelp.client(process.env.YELP_API_KEY);

export async function searchBusinesses(params: {
  latitude: number;
  longitude: number;
  categories?: string[];
  radius?: number; // in meters
  limit?: number;
}) {
  try {
    const { latitude, longitude, categories, radius = 5000, limit = 10 } = params;

    const searchParams: any = {
      latitude,
      longitude,
      radius,
      limit,
      sort_by: 'rating',
      open_now: true
    };

    if (categories?.length) {
      searchParams.categories = categories.join(',');
    }

    const response = await client.search(searchParams);
    return response.jsonBody.businesses.map(business => ({
      id: business.id,
      title: business.name,
      description: `${business.categories.map(c => c.title).join(', ')} • ${business.rating}★`,
      location: business.location.address1,
      type: business.categories[0].alias,
      duration: 60, // default duration in minutes
      energyLevel: Math.ceil(business.rating), // map rating (0-5) to energy level
      weatherDependent: business.is_closed, // if currently closed, might be weather dependent
      indoorActivity: !business.is_closed, // assume open businesses are indoor
      rating: business.rating,
      imageUrl: business.image_url,
      url: business.url,
      phone: business.phone,
      reviews: business.review_count,
      price: business.price,
      source: 'yelp'
    }));
  } catch (error) {
    console.error('Error searching Yelp businesses:', error);
    return [];
  }
}

// Map user preferences to Yelp categories
export function mapPreferencesToCategories(preferences: {
  interests?: string[];
  activityTypes?: string[];
  dietaryRestrictions?: string[];
}) {
  const categoryMap: Record<string, string[]> = {
    // Activity types
    sports: ['active', 'sports_clubs', 'gyms', 'fitness'],
    outdoors: ['hiking', 'parks', 'beaches', 'climbing'],
    relaxation: ['spas', 'massage', 'yoga', 'meditation'],
    entertainment: ['theaters', 'cinema', 'musicvenues', 'bowling'],
    learning: ['education', 'artclasses', 'cookingclasses'],
    social: ['restaurants', 'bars', 'cafes', 'social_clubs'],

    // Interests
    food: ['restaurants', 'food'],
    art: ['galleries', 'museums', 'art'],
    music: ['musicvenues', 'jazzandblues', 'karaoke'],
    technology: ['virtualrealitycenters', 'arcades', 'gaming'],
    nature: ['parks', 'gardens', 'hiking', 'lakes'],
    culture: ['culturalcenter', 'artmuseums', 'theater'],
    shopping: ['shopping', 'fashion', 'retail'],
    wellness: ['health', 'yoga', 'meditation', 'fitness'],

    // Map dietary restrictions to restaurant categories
    vegetarian: ['vegetarian'],
    vegan: ['vegan'],
    glutenfree: ['gluten_free'],
    kosher: ['kosher'],
    halal: ['halal']
  };

  const categories = new Set<string>();

  // Map interests to categories
  if (preferences.interests) {
    preferences.interests.forEach(interest => {
      const mappedCategories = categoryMap[interest.toLowerCase()];
      if (mappedCategories) {
        mappedCategories.forEach(category => categories.add(category));
      }
    });
  }

  // Map activity types to categories
  if (preferences.activityTypes) {
    preferences.activityTypes.forEach(type => {
      const mappedCategories = categoryMap[type.toLowerCase()];
      if (mappedCategories) {
        mappedCategories.forEach(category => categories.add(category));
      }
    });
  }

  // Add dietary restrictions if looking for food
  if (categories.has('restaurants') && preferences.dietaryRestrictions) {
    preferences.dietaryRestrictions.forEach(restriction => {
      const mappedCategories = categoryMap[restriction.toLowerCase()];
      if (mappedCategories) {
        mappedCategories.forEach(category => categories.add(category));
      }
    });
  }

  return Array.from(categories);
}