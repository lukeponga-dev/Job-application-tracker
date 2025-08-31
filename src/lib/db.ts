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
      platform VARCHAR(255),
      "companyName" VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      "dateApplied" DATE NOT NULL,
      status VARCHAR(50) NOT NULL,
      notes TEXT
    );
  `;

  // Check if platform column exists, if not, add it. This is for backwards compatibility.
  const { rows } = await pool.sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name='applications' AND column_name='platform';
  `;

  if (rows.length === 0) {
    await pool.sql`ALTER TABLE applications ADD COLUMN platform VARCHAR(255);`;
  }

  // Clear existing data
  await pool.sql`DELETE FROM applications;`;

  // Seed new data
  await pool.sql`
    INSERT INTO applications (id, platform, "companyName", role, "dateApplied", status, notes) VALUES
    (gen_random_uuid(), 'SEEK', 'Geeks on Wheels', 'Mobile PC Technician and Consultant', '2025-08-30', 'Applied', 'Rotorua, Bay of Plenty'),
    (gen_random_uuid(), 'SEEK', 'PODcom Limited', 'Helpdesk Support Engineer', '2025-08-30', 'Applied', 'Hamilton, Waikato'),
    (gen_random_uuid(), 'SEEK', 'Endace Technology Ltd', 'Endace Summer Internship Program', '2025-08-30', 'Applied', 'Hamilton Central, Waikato'),
    (gen_random_uuid(), '', 'NZ Document Exchange', 'Mail sorter', '2025-08-28', 'Applied', 'Hamilton, Waikato. Visited employer''s application site'),
    (gen_random_uuid(), '', 'Loadscan Limited', 'Customer and Product Support Technician', '2025-08-28', 'Rejected', 'Hamilton Central, Waikato. Unlikely to progress'),
    (gen_random_uuid(), 'SEEK', 'Scenic Hotel Group', 'Maintenance Assistant', '2025-08-27', 'Applied', 'Hamilton Central, Waikato'),
    (gen_random_uuid(), '', 'Embeth', 'Call Centre Agent - Car Loans', '2025-08-27', 'Rejected', 'Hamilton Central, Waikato. Unlikely to progress'),
    (gen_random_uuid(), '', 'Hireace', 'Customer Service & Vehicle Rental Assistant', '2025-08-21', 'Rejected', 'Hamilton Central, Waikato. Unlikely to progress'),
    (gen_random_uuid(), '', 'Hamilton City Council', 'Kennel Attendant', '2025-08-21', 'Rejected', 'Hamilton Central, Waikato. Visited employer''s application site / Expired'),
    (gen_random_uuid(), '', 'Kmart', 'Holiday Casual Team Member Opportunities', '2025-08-20', 'Applied', 'Hamilton, Waikato'),
    (gen_random_uuid(), 'SEEK', 'Geeks on Wheels', 'Mobile PC Technician and Consultant', '2025-08-20', 'Applied', 'Auckland'),
    (gen_random_uuid(), '', 'Fujitsu Australia Limited', 'Advanced On-site Technician', '2025-08-20', 'Applied', 'Hamilton Central, Waikato. Visited employer''s application site'),
    (gen_random_uuid(), '', 'Windsor Industries', 'Warehouse Storeperson / Delivery Driver', '2025-08-17', 'Rejected', 'Te Rapa, Waikato. Unlikely to progress'),
    (gen_random_uuid(), '', 'The Warehouse Group', 'Customer Care Specialist', '2025-08-14', 'Rejected', 'Melville, Waikato. Visited employer''s application site / Expired'),
    (gen_random_uuid(), '', 'Heathcote Appliances', 'Online Customer Service', '2025-08-13', 'Rejected', 'Hamilton Central, Waikato. Unlikely to progress'),
    (gen_random_uuid(), '', 'Animates', 'Sales Assistant - (Part-Time)', '2025-08-12', 'Rejected', 'Te Rapa, Waikato. Visited employer''s application site / Expired'),
    (gen_random_uuid(), 'SEEK', 'Bridged IT Services Limited', 'IT Helpdesk Support', '2025-08-11', 'Applied', 'Hamilton Central, Waikato'),
    (gen_random_uuid(), '', 'New World', 'Part time Supermarket Assistant', '2025-08-11', 'Rejected', 'Te Rapa, Waikato. Visited employer''s application site / Expired'),
    (gen_random_uuid(), '', 'JB Hi Fi Group Pty Ltd', 'Christmas Casual', '2025-08-10', 'Applied', 'Hamilton Central, Waikato. Visited employer''s application site'),
    (gen_random_uuid(), 'SEEK', 'Houston Technology', 'Helpdesk Engineer', '2025-08-08', 'Applied', 'Hamilton Central, Waikato'),
    (gen_random_uuid(), '', 'Lightwire', 'Service Desk Manager', '2025-08-07', 'Rejected', 'Hamilton Central, Waikato. Unlikely to progress / Expired'),
    (gen_random_uuid(), '', 'AKAAL INVESTMENTS LIMITED', 'Courier Driver', '2025-08-27', 'Applied', 'Hamilton, Waikato'),
    (gen_random_uuid(), '', 'TELUS Digital - New Zealand', 'Media Search Analyst', '2025-08-27', 'Applied', '(Location not specified)'),
    (gen_random_uuid(), '', 'Informat Limited', 'Software Engineer', '2025-07-05', 'Interviewing', 'Hamilton, Waikato. Application viewed'),
    (gen_random_uuid(), '', 'Raukura Hauora O Tainui', 'IT Support', '2025-08-01', 'Rejected', 'Te Rapa, Waikato. Expired');
  `;
}
