import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const getDb = () => {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { schema });
};

type DbType = ReturnType<typeof getDb>;

let _db: DbType | null = null;

export const db: DbType = new Proxy({} as DbType, {
  get(_target, prop) {
    if (!_db) {
      _db = getDb();
    }
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});
