'use server';

import { createPool, sql as vercelSql, VercelPool } from '@vercel/postgres';

let pool: VercelPool | undefined;

function getDbPool() {
  if (!pool) {
    if (process.env.POSTGRES_URL) {
      pool = createPool({
        connectionString: process.env.POSTGRES_URL,
      });
    } else if (process.env.NETLIFY_DATABASE_URL) {
      pool = createPool({
        connectionString: process.env.NETLIFY_DATABASE_URL,
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
      "companyName" VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      "dateApplied" DATE NOT NULL,
      status VARCHAR(50) NOT NULL,
      notes TEXT
    );
  `;
}
