const RESPONSE_GENERATION_PROMPT = `
You are a friendly weather assistant.

User asked: "{userMessage}"

Weather data:
- City: {city}
- Temperature: {temp}°C
- Condition: {condition}
- Humidity: {humidity}%
- Wind: {windSpeed} km/h

Generate a natural, friendly response (2-3 sentences).
Include relevant emoji. Be conversational.
`;
export { RESPONSE_GENERATION_PROMPT };

const ERROR_HANDLING_PROMPT = `
You are a helpful weather assistant.

User asked: "{userMessage}"

An error occurred while fetching weather data: "{errorMessage}"

Apologize for the inconvenience and suggest the user try again later or check their input.
Keep the response polite and concise (1-2 sentences).
`;
export { ERROR_HANDLING_PROMPT };

const FORECAST_SUMMARY_PROMPT = `
You are a knowledgeable weather assistant.

User asked: "{userMessage}"

Weather forecast data for {city}:
{forecastData}

Summarize the 5-day weather forecast in a friendly manner (3-4 sentences).
Highlight any significant weather changes or events.
`;
export { FORECAST_SUMMARY_PROMPT };const INTENT_EXTRACTION_PROMPT = `
You are a weather query analyzer.

User message: "{userMessage}"

Extract intent and entities. Return ONLY valid JSON:
{
  "intent": "current_weather" | "forecast" | "general_question",
  "city": "city name or null",
  "timeframe": "now" | "today" | "tomorrow" | "week"
}
`;
export { INTENT_EXTRACTION_PROMPT };