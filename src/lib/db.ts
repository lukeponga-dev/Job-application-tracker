'use server';

import { createPool, sql as vercelSql, VercelPool } from '@vercel/postgres';

let pool: VercelPool | undefined;

const NEON_CONNECTION_STRING = "postgresql://neondb_owner:npg_iIbLcNJ1p9Zt@ep-plain-frost-ad2lewzm-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

function getDbPool() {
  if (!pool) {
    const connectionString = NEON_CONNECTION_STRING || process.env.POSTGRES_URL || process.env.NETLIFY_DATABASE_URL;
    if (connectionString) {
      pool = createPool({
        connectionString: connectionString,
      });
    }
  }
  return pool;
}

export const sql = async (
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<any> => {
  const pool = getDbPool();
  if (pool) {
    return await pool.sql(strings, ...values);
  }
  // Fallback for environments where pool is not created, though it might fail if not configured.
  return await vercelSql(strings, ...values);
};

export async function createApplicationsTable() {
  const pool = getDbPool();
  if (!pool) {
    console.log("Database connection not configured, skipping table creation.");
    return;
  }
  
  await pool.sql`
    CREATE TABLE IF NOT EXISTS applications (
      id UUID PRIMARY KEY,
      platform VARCHAR(255),
      "companyName" VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      "dateApplied" DATE NOT NULL,
      status VARCHAR(50) NOT NULL,
      notes TEXT
    );
  `;
}
