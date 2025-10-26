import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from 'dotenv';
import { createDb } from '@xg2huo/db';
import { usersRoutes } from './routes/users.js';
import { categoriesRoutes } from './routes/categories.js';
import { locationsRoutes } from './routes/locations.js';
import { listingsRoutes } from './routes/listings.js';
import { favoritesRoutes } from './routes/favorites.js';

config();

const fastify = Fastify({
  logger: true,
});

// Initialize database
const db = createDb();

// Register CORS
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
});

// Make db available in routes
fastify.decorate('db', db);

// Register routes
await fastify.register(usersRoutes, { prefix: '/api/users' });
await fastify.register(categoriesRoutes, { prefix: '/api/categories' });
await fastify.register(locationsRoutes, { prefix: '/api/locations' });
await fastify.register(listingsRoutes, { prefix: '/api/listings' });
await fastify.register(favoritesRoutes, { prefix: '/api/favorites' });

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    const host = process.env.HOST || '0.0.0.0';
    await fastify.listen({ port, host });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

declare module 'fastify' {
  interface FastifyInstance {
    db: ReturnType<typeof createDb>;
  }
}
