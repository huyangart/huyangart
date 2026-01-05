import { FastifyPluginAsync } from 'fastify';
import { eq, and } from 'drizzle-orm';
import { favorites } from '@xg2huo/db';
import { parsePagination } from '../utils/pagination';

export const favoritesRoutes: FastifyPluginAsync = async (fastify) => {
  // Get user's favorites
  fastify.get('/user/:userId', async (request, _reply) => {
    const { userId } = request.params as { userId: string };
    const { page, limit, offset } = parsePagination(
      request.query as { page?: string; limit?: string },
      { page: 1, limit: 20 },
    );

    const results = await fastify.db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId))
      .limit(limit)
      .offset(offset);

    return { data: results, page, limit };
  });

  // Add favorite
  fastify.post('/', async (request, reply) => {
    const body = request.body as {
      userId: string;
      listingId: string;
    };

    const [newFavorite] = await fastify.db
      .insert(favorites)
      .values({
        userId: body.userId,
        listingId: body.listingId,
      })
      .returning();

    reply.code(201);
    return { data: newFavorite };
  });

  // Remove favorite
  fastify.delete('/', async (request, reply) => {
    const body = request.body as {
      userId: string;
      listingId: string;
    };

    await fastify.db
      .delete(favorites)
      .where(and(eq(favorites.userId, body.userId), eq(favorites.listingId, body.listingId)));

    reply.code(204);
    return;
  });
};
