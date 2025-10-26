import { FastifyPluginAsync } from 'fastify';
import { eq, desc } from 'drizzle-orm';
import { listings, images } from '@xg2huo/db';

export const listingsRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all listings with pagination
  fastify.get('/', async (request, reply) => {
    const { page = '1', limit = '20' } = request.query as { page?: string; limit?: string };
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const results = await fastify.db
      .select()
      .from(listings)
      .orderBy(desc(listings.createdAt))
      .limit(limitNum)
      .offset(offset);

    return { data: results, page: pageNum, limit: limitNum };
  });

  // Get listing by ID with images
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const [listing] = await fastify.db.select().from(listings).where(eq(listings.id, id));

    if (!listing) {
      reply.code(404);
      return { error: 'Listing not found' };
    }

    const listingImages = await fastify.db
      .select()
      .from(images)
      .where(eq(images.listingId, id));

    return { data: { ...listing, images: listingImages } };
  });

  // Create listing
  fastify.post('/', async (request, reply) => {
    const body = request.body as {
      title: string;
      description: string;
      price: number;
      currency?: string;
      categoryId: string;
      locationId: string;
      userId: string;
      status?: string;
    };

    const [newListing] = await fastify.db
      .insert(listings)
      .values({
        title: body.title,
        description: body.description,
        price: body.price,
        currency: body.currency || 'USD',
        categoryId: body.categoryId,
        locationId: body.locationId,
        userId: body.userId,
        status: body.status || 'active',
      })
      .returning();

    reply.code(201);
    return { data: newListing };
  });

  // Update listing
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as {
      title?: string;
      description?: string;
      price?: number;
      currency?: string;
      categoryId?: string;
      locationId?: string;
      status?: string;
    };

    const [updatedListing] = await fastify.db
      .update(listings)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(listings.id, id))
      .returning();

    if (!updatedListing) {
      reply.code(404);
      return { error: 'Listing not found' };
    }

    return { data: updatedListing };
  });

  // Delete listing
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await fastify.db.delete(listings).where(eq(listings.id, id));
    reply.code(204);
    return;
  });

  // Add image to listing
  fastify.post('/:id/images', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as { url: string; order?: number };

    const [newImage] = await fastify.db
      .insert(images)
      .values({
        listingId: id,
        url: body.url,
        order: body.order || 0,
      })
      .returning();

    reply.code(201);
    return { data: newImage };
  });
};
