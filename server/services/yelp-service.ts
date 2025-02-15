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
      price: business.price
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
}) {
  const categoryMap: Record<string, string[]> = {
    sports: ['active', 'sports_clubs', 'gyms'],
    food: ['restaurants', 'food'],
    culture: ['museums', 'art', 'theater'],
    outdoors: ['hiking', 'parks', 'beaches'],
    entertainment: ['entertainment', 'nightlife', 'movies'],
    education: ['education', 'libraries', 'tutoring'],
    shopping: ['shopping', 'fashion'],
    wellness: ['health', 'yoga', 'meditation'],
  };

  const categories = new Set<string>();
  
  if (preferences.interests) {
    preferences.interests.forEach(interest => {
      const mappedCategories = categoryMap[interest.toLowerCase()];
      if (mappedCategories) {
        mappedCategories.forEach(category => categories.add(category));
      }
    });
  }

  if (preferences.activityTypes) {
    preferences.activityTypes.forEach(type => {
      const mappedCategories = categoryMap[type.toLowerCase()];
      if (mappedCategories) {
        mappedCategories.forEach(category => categories.add(category));
      }
    });
  }

  return Array.from(categories);
}
