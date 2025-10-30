import axios from 'axios';

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export const weatherService = {
  /**
   * Get current weather data by coordinates
   */
  async getCurrentWeather(latitude: number, longitude: number) {
    try {
      const response = await axios.get(WEATHER_API, {
        params: {
          latitude,
          longitude,
          current_weather: true,
          hourly: 'temperature_2m,relative_humidity_2m,weathercode,windspeed_10m',
        },
      });

      const current = response.data.current_weather;
      const humidity = response.data.hourly?.relative_humidity_2m?.[0] || null;
      const weatherDescription = mapWeatherCode(current.weathercode);

      return {
        temperature: current.temperature,
        feelsLike: current.temperature,
        weatherDescription,
        humidity,
        windSpeed: current.windspeed,
      };
    } catch (error) {
      console.error('Error in weatherService.getCurrentWeather:', error);
      throw new Error('Failed to fetch current weather');
    }
  },

  /**
   * Get weather forecast for next N days
   */
  async getForecast(latitude: number, longitude: number, days: number) {
    try {
      const response = await axios.get(WEATHER_API, {
        params: {
          latitude,
          longitude,
          daily: 'temperature_2m_max,temperature_2m_min,weathercode',
          timezone: 'auto',
        },
      });

      const forecast = response.data.daily.time.map((date: string, i: number) => ({
        date,
        minTemp: response.data.daily.temperature_2m_min[i],
        maxTemp: response.data.daily.temperature_2m_max[i],
        condition: mapWeatherCode(response.data.daily.weathercode[i]),
      }));

      return forecast.slice(0, days);
    } catch (error) {
      console.error('Error in weatherService.getForecast:', error);
      throw new Error('Failed to fetch forecast');
    }
  },
};

/**
 * Helper: map Open-Meteo weather codes to readable text
 */
function mapWeatherCode(code: number): string {
  const weatherCodes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Rime fog',
    51: 'Light drizzle',
    61: 'Rain',
    71: 'Snow',
    80: 'Rain showers',
    95: 'Thunderstorm',
  };
  return weatherCodes[code] || 'Unknown';
}
