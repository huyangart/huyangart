import { FastifyPluginAsync } from 'fastify';
import { eq } from 'drizzle-orm';
import { users } from '@xg2huo/db';

export const usersRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all users with pagination
  fastify.get('/', async (request, reply) => {
    const { page = '1', limit = '10' } = request.query as { page?: string; limit?: string };
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const results = await fastify.db.select().from(users).limit(limitNum).offset(offset);
    return { data: results, page: pageNum, limit: limitNum };
  });

  // Get user by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const [user] = await fastify.db.select().from(users).where(eq(users.id, id));

    if (!user) {
      reply.code(404);
      return { error: 'User not found' };
    }

    return { data: user };
  });

  // Create user
  fastify.post('/', async (request, reply) => {
    const body = request.body as {
      email: string;
      passwordHash: string;
      name?: string;
      phone?: string;
    };

    const [newUser] = await fastify.db
      .insert(users)
      .values({
        email: body.email,
        passwordHash: body.passwordHash,
        name: body.name,
        phone: body.phone,
      })
      .returning();

    reply.code(201);
    return { data: newUser };
  });

  // Update user
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as {
      email?: string;
      name?: string;
      phone?: string;
    };

    const [updatedUser] = await fastify.db
      .update(users)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      reply.code(404);
      return { error: 'User not found' };
    }

    return { data: updatedUser };
  });

  // Delete user
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await fastify.db.delete(users).where(eq(users.id, id));
    reply.code(204);
    return;
  });
};
