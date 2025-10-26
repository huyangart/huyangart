import { FastifyPluginAsync } from 'fastify';
import { eq, and } from 'drizzle-orm';
import { favorites } from '@xg2huo/db';

export const favoritesRoutes: FastifyPluginAsync = async (fastify) => {
  // Get user's favorites
  fastify.get('/user/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const { page = '1', limit = '20' } = request.query as { page?: string; limit?: string };
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const results = await fastify.db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId))
      .limit(limitNum)
      .offset(offset);

    return { data: results, page: pageNum, limit: limitNum };
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
