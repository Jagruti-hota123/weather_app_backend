import axios from 'axios';
import { env } from './env.js';

export const groqClient = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: {
    'Authorization': `Bearer ${env.GROQ_API_KEY}`,
  },
  timeout: 30000,
});

export const groqConfig = {
  model: 'llama-3.3-70b-versatile', 
  temperature: 0.7,
  maxTokens: 500,
};
