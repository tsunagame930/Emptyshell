import dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.log("❌ DATABASE_URL non chargée");
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

console.log("✅ DATABASE_URL détectée :", process.env.DATABASE_URL);

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
