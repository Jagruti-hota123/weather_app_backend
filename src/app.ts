import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes.js';
import mongoose from 'mongoose';
import { env } from './config/env.js';

dotenv.config();

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
const RATE_LIMIT_WINDOW = process.env.RATE_LIMIT_WINDOW || '15m';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

export const app = Fastify({
  logger: {
    level: LOG_LEVEL,
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
});

export const registerPlugins = async () => {
  // CORS
  await app.register(cors, {
    origin: CORS_ORIGIN,
    credentials: true,
  });

  // Helmet for security
  await app.register(helmet, {
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
  });

  // Rate limiting
  await app.register(rateLimit, {
    max: RATE_LIMIT_MAX,
    timeWindow: RATE_LIMIT_WINDOW,
  });

  // Health check endpoint
  app.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  });

  app.register(chatRoutes, { prefix: '/api/chat' });
  // Root endpoint
  app.get('/', async () => {
    return {
      message: 'Weather API Server',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        weather: '/api/weather/*',
      },
    };
  });

  app.log.info('✅ Plugins registered successfully');
};



export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default app;