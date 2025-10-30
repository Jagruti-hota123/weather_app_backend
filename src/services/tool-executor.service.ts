import { geocodingService } from './geocoding.service.js';
import { weatherService } from './weather.service.js';

export const executeWeatherTool = async (
  toolName: string,
  args: any
) => {
  try {
    switch (toolName) {
      case 'get_current_weather': {
        const { city } = args;
        
        // Step 1: Get coordinates for the city
        const locations = await geocodingService.searchCity(city);
        
        if (!locations || locations.length === 0) {
          return { 
            error: true,
            message: `Sorry, I couldn't find the city "${city}". Please check the spelling or try a different city.`
          };
        }
        
        const location = locations[0];
        
        // Step 2: Get current weather
        const weather = await weatherService.getCurrentWeather(
          location.latitude,
          location.longitude
        );
        
        return {
          error: false,
          city: location.name,
          country: location.country,
          temperature: weather.temperature,
          feelsLike: weather.feelsLike,
          condition: weather.weatherDescription,
          humidity: weather.humidity,
          windSpeed: weather.windSpeed
        };
      }
      
      case 'get_weather_forecast': {
        const { city, days = 5 } = args;
        
        // Step 1: Get coordinates
        const locations = await geocodingService.searchCity(city);
        
        if (!locations || locations.length === 0) {
          return { 
            error: true,
            message: `Sorry, I couldn't find the city "${city}". Please check the spelling.`
          };
        }
        
        const location = locations[0];
        
        // Step 2: Get forecast
        const forecast = await weatherService.getForecast(
          location.latitude,
          location.longitude,
          days
        );
        
        return {
          error: false,
          city: location.name,
          country: location.country,
          days: days,
          forecast: forecast
        };
      }
      
      default:
        return { 
          error: true,
          message: `Unknown tool: ${toolName}`
        };
    }
  } catch (error: any) {
    console.error(`Error executing tool ${toolName}:`, error);
    return {
      error: true,
      message: `Failed to get weather data: ${error.message}`
    };
  }
};