'use server';

import type { Application, Status } from './types';
import { ApplicationSchema } from './types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { sql } from './db';

// This function is not used, but it's a good example of how to parse data from the database
// if the column names don't match the object properties.
function fromDb(app: Record<string, any>): Application {
    const parsed = ApplicationSchema.parse({
        id: app.id,
        platform: app.platform,
        companyName: app.companyname,
        role: app.role,
        dateApplied: app.dateapplied,
        status: app.status,
        notes: app.notes,
    });
    return parsed;
}

export async function getApplications(): Promise<Application[]> {
  // Use correct column names with quotes to preserve casing
  const { rows } = await sql`SELECT id, platform, "companyName", role, "dateApplied", status, notes FROM applications ORDER BY "dateApplied" DESC;`;
  
  // The 'rows' from vercel/postgres are already parsed into JS types.
  // We just need to validate against our schema.
  // We'll create a schema that matches the database return shape.
  const DbRowSchema = z.object({
      id: z.string(),
      platform: z.string().nullable().optional(),
      companyName: z.string(),
      role: z.string(),
      dateApplied: z.date(),
      status: z.enum(["Applied", "Interviewing", "Offer", "Rejected"]),
      notes: z.string().nullable().optional(),
  });

  const appSchema = DbRowSchema.transform(row => ({
      ...row,
      platform: row.platform ?? "", // ensure platform is a string
      notes: row.notes ?? "", // Ensure notes is a string
  }));
  
  const applicationsListSchema = z.array(appSchema);
  
  const parsedApplications = applicationsListSchema.safeParse(rows);

  if (!parsedApplications.success) {
    console.error("Failed to parse applications:", parsedApplications.error);
    return [];
  }

  return parsedApplications.data;
}


export async function saveApplication(application: Application): Promise<Application> {
    const { id, platform, companyName, role, dateApplied, status, notes } = ApplicationSchema.parse(application);

    const existing = await sql`SELECT id FROM applications WHERE id = ${id}`;

    let savedApp;
    if (existing.rowCount > 0) {
        const { rows } = await sql`
            UPDATE applications
            SET platform = ${platform}, "companyName" = ${companyName}, role = ${role}, "dateApplied" = ${dateApplied.toISOString().split('T')[0]}, status = ${status}, notes = ${notes}
            WHERE id = ${id}
            RETURNING id, platform, "companyName", role, "dateApplied", status, notes;
        `;
        savedApp = rows[0]
    } else {
        const { rows } = await sql`
            INSERT INTO applications (id, platform, "companyName", role, "dateApplied", status, notes)
            VALUES (${id}, ${platform}, ${companyName}, ${role}, ${dateApplied.toISOString().split('T')[0]}, ${status}, ${notes})
            RETURNING id, platform, "companyName", role, "dateApplied", status, notes;
        `;
        savedApp = rows[0];
    }
    revalidatePath('/');
    
    // We need to parse the returned data to match the Application type
    const DbRowSchema = z.object({
        id: z.string(),
        platform: z.string().nullable(),
        companyName: z.string(),
        role: z.string(),
        dateApplied: z.date(),
        status: z.enum(["Applied", "Interviewing", "Offer", "Rejected"]),
        notes: z.string().nullable(),
    });
    
    const parsedApp = DbRowSchema.transform(row => ({
        ...row,
        platform: row.platform ?? "",
        notes: row.notes ?? "",
    })).parse(savedApp);

    return parsedApp;
}


export async function deleteApplication(id: string): Promise<void> {
  await sql`DELETE FROM applications WHERE id = ${id};`;
  revalidatePath('/');
}

export async function updateApplicationStatus(id: string, status: Status): Promise<void> {
  await sql`UPDATE applications SET status = ${status} WHERE id = ${id};`;
  revalidatePath('/');
}
