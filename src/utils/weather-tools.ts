export const weatherTools = [
  {
    type: "function",
    function: {
      name: "get_current_weather",
      description: "Get current weather information for a specific city. Use this when the user asks about current weather, temperature, conditions, humidity, or wind speed.",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "The name of the city (e.g., 'London', 'New York', 'Tokyo')"
          }
        },
        required: ["city"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_weather_forecast",
      description: "Get weather forecast for the next several days. Use this when the user asks about future weather, tomorrow's weather, or weekly forecast.",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "The name of the city"
          },
          days: {
            type: "number",
            description: "Number of days to forecast (1-7). Default is 5.",
            minimum: 1,
            maximum: 7
          }
        },
        required: ["city"]
      }
    }
  }
];