import { drizzle } from 'drizzle-orm/libsql';

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
    syncUrl: process.env.TURSO_DATABASE_URL!,
    syncInterval: 300000, // 5 minutos
  },
});
