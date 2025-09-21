import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { schema } from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("Environment variable didn't load with DATABASE_URL=.");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle({ client: sql, schema });

export { db, schema };
