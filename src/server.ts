import { app, connectDatabase, registerPlugins } from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';


const start = async () => {
  try {

    await connectDatabase();

    // Register Fastify plugins
    await registerPlugins();

    // TODO: Register routes here when created
    // Example:
    // await app.register(weatherRoutes, { prefix: '/api/weather' });

    // Start server
    await app.listen({
      port: PORT,
      host: HOST,
    });

    console.log('Weather API Server Started!');
    console.log(`Server: http://${HOST}:${PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received, shutting down gracefully...`);
  try {
    await app.close();
    console.log('Server closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

start();