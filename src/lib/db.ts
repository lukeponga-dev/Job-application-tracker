'use server';

import { createPool, sql as vercelSql, VercelPool } from '@vercel/postgres';

let pool: VercelPool | undefined;

function getDbPool() {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL;
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
      "userId" VARCHAR(255) NOT NULL,
      platform VARCHAR(255),
      "companyName" VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      "dateApplied" DATE NOT NULL,
      status VARCHAR(50) NOT NULL,
      notes TEXT,
      FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
    );
  `;
}

export async function createUsersTable() {
    const pool = getDbPool();
    if (!pool) {
      console.log("Database connection not configured, skipping table creation.");
      return;
    }
    
    await pool.sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
}