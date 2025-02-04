declare module 'yelp-api-v3' {
  export class YelpAPI {
    constructor(apiKey: string);
    search(params: {
      latitude: number;
      longitude: number;
      radius?: number;
      categories?: string;
      limit?: number;
    }): Promise<{
      businesses: Array<{
        name: string;
        rating: number;
        location: {
          address1: string;
          city: string;
        };
        categories: Array<{
          alias: string;
          title: string;
        }>;
      }>;
    }>;
  }
}
