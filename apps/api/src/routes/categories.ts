import { FastifyPluginAsync } from 'fastify';
import { eq } from 'drizzle-orm';
import { categories } from '@xg2huo/db';
import { parsePagination } from '../utils/pagination';

export const categoriesRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all categories with pagination
  fastify.get('/', async (request, _reply) => {
    const { page, limit, offset } = parsePagination(
      request.query as { page?: string; limit?: string },
      { page: 1, limit: 50 },
    );

    const results = await fastify.db.select().from(categories).limit(limit).offset(offset);
    return { data: results, page, limit };
  });

  // Get category by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const [category] = await fastify.db.select().from(categories).where(eq(categories.id, id));

    if (!category) {
      reply.code(404);
      return { error: 'Category not found' };
    }

    return { data: category };
  });

  // Create category
  fastify.post('/', async (request, reply) => {
    const body = request.body as {
      name: string;
      slug: string;
      parentId?: string;
    };

    const [newCategory] = await fastify.db
      .insert(categories)
      .values({
        name: body.name,
        slug: body.slug,
        parentId: body.parentId,
      })
      .returning();

    reply.code(201);
    return { data: newCategory };
  });

  // Update category
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as {
      name?: string;
      slug?: string;
      parentId?: string;
    };

    const [updatedCategory] = await fastify.db
      .update(categories)
      .set(body)
      .where(eq(categories.id, id))
      .returning();

    if (!updatedCategory) {
      reply.code(404);
      return { error: 'Category not found' };
    }

    return { data: updatedCategory };
  });

  // Delete category
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await fastify.db.delete(categories).where(eq(categories.id, id));
    reply.code(204);
    return;
  });
};
