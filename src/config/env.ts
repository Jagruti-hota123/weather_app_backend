import dotenv from 'dotenv';

dotenv.config();

export const env = {
  GROQ_API_KEY: process.env.GROQ_API_KEY!,
 MONGODB_URI: process.env.MONGODB_URI!,

};