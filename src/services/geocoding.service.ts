import axios from 'axios';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

export const geocodingService = {
  /**
   * Search a city by name and return coordinates.
   */
  async searchCity(city: string) {
    try {
      const response = await axios.get(GEOCODING_API, {
        params: { name: city, count: 1 },
      });

      if (!response.data.results || response.data.results.length === 0) {
        return [];
      }

      // Return first match
      return response.data.results.map((result: any) => ({
        name: result.name,
        country: result.country,
        latitude: result.latitude,
        longitude: result.longitude,
      }));
    } catch (error) {
      console.error('Error in geocodingService.searchCity:', error);
      throw new Error('Failed to fetch coordinates');
    }
  },
};
