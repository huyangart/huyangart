import { FastifyPluginAsync } from 'fastify';
import { eq } from 'drizzle-orm';
import { categories } from '@xg2huo/db';

export const categoriesRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all categories with pagination
  fastify.get('/', async (request, reply) => {
    const { page = '1', limit = '50' } = request.query as { page?: string; limit?: string };
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const results = await fastify.db.select().from(categories).limit(limitNum).offset(offset);
    return { data: results, page: pageNum, limit: limitNum };
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
