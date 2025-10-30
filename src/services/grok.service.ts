import { ChatResponse } from "../types/chat.types.js";
import { conversationService } from "./Conversation.service.js";
import { groqClient, groqConfig } from "../config/grok.js";
import { weatherTools } from "../utils/weather-tools.js";
import { executeWeatherTool } from "./tool-executor.service.js";

export const chatWithGrok = async (
  userMessage: string,
  conversationId: string
): Promise<ChatResponse> => {
  // Step 1: Save user message to DB
  await conversationService.addMessage(conversationId, {
    role: 'user',
    content: userMessage,
    timestamp: new Date(),
  });

  const messages: any[] = [
    {
      role: 'system',
      content: 'You are a friendly weather assistant. Use the available tools to get weather data when needed. Always provide helpful, conversational responses with appropriate emojis.'
    },
    {
      role: 'user',
      content: userMessage
    }
  ];
  
  // Step 2: Initial call to Groq with tools
  const response = await groqClient.post('/chat/completions', {
    model: groqConfig.model,
    messages: messages,
    tools: weatherTools,
    tool_choice: 'auto',
  });
  
  const assistantMessage = response.data.choices[0].message;
  
  // Step 3: Check if Groq wants to call a tool
  if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
    const toolCall = assistantMessage.tool_calls[0];
    const toolName = toolCall.function.name;
    const toolArgs = JSON.parse(toolCall.function.arguments);
    
    console.log(`🔧 Groq calling tool: ${toolName}`, toolArgs);
    
    // Execute the tool
    const toolResult = await executeWeatherTool(toolName, toolArgs);
    
    // Add messages for second Groq call
    messages.push(assistantMessage);
    messages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      content: JSON.stringify(toolResult)
    });
    
    // Get final response from Groq
    const finalResponse = await groqClient.post('/chat/completions', {
      model: groqConfig.model,
      messages: messages,
    });
    
    const botResponse = finalResponse.data.choices[0].message.content;

    // Step 4: Save assistant message to DB
    await conversationService.addMessage(conversationId, {
      role: 'assistant',
      content: botResponse,
      toolUsed: toolName,
      weatherData: toolResult,
      timestamp: new Date(),
    });
    
    return {
      message: botResponse,
      toolUsed: toolName,
      weatherData: toolResult
    };
  }
  
  // No tool needed - save direct response
  const botResponse = assistantMessage.content;
  
  await conversationService.addMessage(conversationId, {
    role: 'assistant',
    content: botResponse,
    timestamp: new Date(),
  });

  return {
    message: botResponse,
    toolUsed: null,
    weatherData: null
  };
};