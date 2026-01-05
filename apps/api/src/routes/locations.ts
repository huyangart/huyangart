import { FastifyPluginAsync } from 'fastify';
import { eq } from 'drizzle-orm';
import { locations } from '@xg2huo/db';
import { parsePagination } from '../utils/pagination';

export const locationsRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all locations with pagination
  fastify.get('/', async (request, _reply) => {
    const { page, limit, offset } = parsePagination(
      request.query as { page?: string; limit?: string },
      { page: 1, limit: 50 },
    );

    const results = await fastify.db.select().from(locations).limit(limit).offset(offset);
    return { data: results, page, limit };
  });

  // Get location by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const [location] = await fastify.db.select().from(locations).where(eq(locations.id, id));

    if (!location) {
      reply.code(404);
      return { error: 'Location not found' };
    }

    return { data: location };
  });

  // Create location
  fastify.post('/', async (request, reply) => {
    const body = request.body as {
      country: string;
      city: string;
      lat?: number;
      lng?: number;
    };

    const [newLocation] = await fastify.db
      .insert(locations)
      .values({
        country: body.country,
        city: body.city,
        lat: body.lat,
        lng: body.lng,
      })
      .returning();

    reply.code(201);
    return { data: newLocation };
  });

  // Update location
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as {
      country?: string;
      city?: string;
      lat?: number;
      lng?: number;
    };

    const [updatedLocation] = await fastify.db
      .update(locations)
      .set(body)
      .where(eq(locations.id, id))
      .returning();

    if (!updatedLocation) {
      reply.code(404);
      return { error: 'Location not found' };
    }

    return { data: updatedLocation };
  });

  // Delete location
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await fastify.db.delete(locations).where(eq(locations.id, id));
    reply.code(204);
    return;
  });
};
