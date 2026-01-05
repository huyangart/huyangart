import { FastifyPluginAsync } from 'fastify';
import { eq } from 'drizzle-orm';
import { users } from '@xg2huo/db';
import { parsePagination } from '../utils/pagination';

export const usersRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all users with pagination
  fastify.get('/', async (request, _reply) => {
    const { page, limit, offset } = parsePagination(
      request.query as { page?: string; limit?: string },
      { page: 1, limit: 10 },
    );

    const results = await fastify.db.select().from(users).limit(limit).offset(offset);
    return { data: results, page, limit };
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
