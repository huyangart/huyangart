import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

export * from './schema';

export function createDb(url?: string, authToken?: string) {
  const client = createClient({
    url: url || process.env.DATABASE_URL || 'file:./local.db',
    authToken: authToken || process.env.DATABASE_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
}

export type DB = ReturnType<typeof createDb>;
