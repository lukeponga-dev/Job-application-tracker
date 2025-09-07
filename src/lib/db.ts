'use server';

import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { headers } from 'next/headers';

let dbOwner: NeonQueryFunction<false, false> | undefined;

function getDbOwner() {
    if (!dbOwner) {
        const connectionString = process.env.POSTGRES_URL;
        if (connectionString) {
            dbOwner = neon(connectionString, {
                fetchOptions: {
                    cache: 'no-store'
                }
            });
        } else {
            throw new Error("Database owner connection string not configured.");
        }
    }
    return dbOwner;
}

export async function getDb(): Promise<NeonQueryFunction<false, false>> {
    const authHeader = headers().get('Authorization');
    const token = authHeader?.split('Bearer ')[1];
    const url = process.env.DATABASE_AUTHENTICATED_URL;

    if (!url) {
        throw new Error("Authenticated database connection string not configured.");
    }
    
    return neon(url, {
        fetchOptions: {
            cache: 'no-store'
        },
        authToken: token,
    });
};


export async function runDbMigrations() {
  const sql = getDbOwner();
  
  await sql`CREATE EXTENSION IF NOT EXISTS pg_session_jwt;`;
  
  await createUsersTable();
  await createApplicationsTable();

  // Grant permissions to roles
  await sql`GRANT USAGE ON SCHEMA public TO authenticated;`;
  await sql`GRANT USAGE ON SCHEMA public TO anonymous;`;

  await sql`
    GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
    IN SCHEMA public
    TO authenticated;
  `;
  await sql`
    GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
    IN SCHEMA public
    TO anonymous;
  `;
  await sql`
    ALTER DEFAULT PRIVILEGES
    IN SCHEMA public
    GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
    TO authenticated;
  `;
  await sql`
    ALTER DEFAULT PRIVILEGES
    IN SCHEMA public
    GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
    TO anonymous;
  `;
}

export async function createApplicationsTable() {
  const sql = getDbOwner();
  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id UUID PRIMARY KEY,
      "userId" VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      platform VARCHAR(255),
      "companyName" VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      "dateApplied" DATE NOT NULL,
      status VARCHAR(50) NOT NULL,
      notes TEXT
    );
  `;

  // RLS Policy for applications
  await sql`ALTER TABLE applications ENABLE ROW LEVEL SECURITY;`;
  await sql`
    DROP POLICY IF EXISTS "user_can_access_own_applications" ON applications;
  `;
  await sql`
    CREATE POLICY "user_can_access_own_applications" ON applications
    FOR ALL
    TO authenticated
    USING ("userId" = session_user_id())
    WITH CHECK ("userId" = session_user_id());
  `;
}

export async function createUsersTable() {
    const sql = getDbOwner();
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // RLS Policy for users
    await sql`ALTER TABLE users ENABLE ROW LEVEL SECURITY;`;
    await sql`
      DROP POLICY IF EXISTS "user_can_access_own_data" ON users;
    `;
    await sql`
      CREATE POLICY "user_can_access_own_data" ON users
      FOR ALL
      TO authenticated
      USING (id = session_user_id())
      WITH CHECK (id = session_user_id());
    `;
}
