
import { Client } from "@googlemaps/google-maps-services-js";
import { Yelp } from "yelp-api-v3";

const googleMapsClient = new Client({});
const yelpClient = new Yelp(process.env.YELP_API_KEY);

export async function searchNearbyPlaces(lat: number, lng: number, type: string) {
  const [googlePlaces, yelpPlaces] = await Promise.all([
    searchGooglePlaces(lat, lng, type),
    searchYelpPlaces(lat, lng, type)
  ]);

  return [...googlePlaces, ...yelpPlaces];
}

async function searchGooglePlaces(lat: number, lng: number, type: string) {
  try {
    const response = await googleMapsClient.placesNearby({
      params: {
        location: { lat, lng },
        radius: 5000,
        type: type as google.maps.places.PlaceType,
        key: process.env.GOOGLE_PLACES_API_KEY,
      },
    });

    return response.data.results.map(place => ({
      title: place.name,
      description: `Rating: ${place.rating}/5`,
      location: place.vicinity,
      type: type,
      source: 'google',
    }));
  } catch (error) {
    console.error('Google Places API error:', error);
    return [];
  }
}

async function searchYelpPlaces(lat: number, lng: number, type: string) {
  try {
    const response = await yelpClient.search({
      latitude: lat,
      longitude: lng,
      categories: type,
      radius: 5000,
    });

    return response.businesses.map(business => ({
      title: business.name,
      description: `Rating: ${business.rating}/5`,
      location: business.location.address1,
      type: type,
      source: 'yelp',
    }));
  } catch (error) {
    console.error('Yelp API error:', error);
    return [];
  }
}
