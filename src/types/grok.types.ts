export interface GroqToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required: string[];
    };
  };
}

export interface GroqChatCompletionRequest {
  model: string;
  messages: any[];
  tools?: GroqToolDefinition[];
  tool_choice?: 'auto' | 'none';
  temperature?: number;
  max_tokens?: number;
}

export interface GroqChatCompletionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
      tool_calls?: Array<{
        id: string;
        type: 'function';
        function: {
          name: string;
          arguments: string;
        };
      }>;
    };
  }>;
}