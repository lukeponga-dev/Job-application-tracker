'use server';

import type { Application, Status } from './types';
import { ApplicationSchema } from './types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { sql } from './db';


const ApplicationDBSchema = ApplicationSchema.extend({
  companyName: z.string(),
  dateApplied: z.date(),
});

function fromDb(app: z.infer<typeof ApplicationDBSchema>): Application {
    const parsed = ApplicationDBSchema.parse(app);
    return {
        id: parsed.id,
        companyName: parsed.companyName,
        role: parsed.role,
        dateApplied: parsed.dateApplied,
        status: parsed.status,
        notes: parsed.notes,
    }
}

export async function getApplications(): Promise<Application[]> {
  // Use correct column names with quotes to preserve casing
  const { rows } = await sql`SELECT id, "companyName", role, "dateApplied", status, notes FROM applications ORDER BY "dateApplied" DESC;`;
  
  // The 'rows' from vercel/postgres are already parsed into JS types.
  // We just need to validate against our schema.
  // We'll create a schema that matches the database return shape.
  const DbRowSchema = z.object({
      id: z.string(),
      companyName: z.string(),
      role: z.string(),
      dateApplied: z.date(),
      status: z.enum(["Applied", "Interviewing", "Offer", "Rejected"]),
      notes: z.string().nullable().optional(),
  });

  const appSchema = DbRowSchema.transform(row => ({
      ...row,
      notes: row.notes ?? undefined,
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
    const { id, companyName, role, dateApplied, status, notes } = application;

    const existing = await sql`SELECT id FROM applications WHERE id = ${id}`;

    let savedApp;
    if (existing.rowCount > 0) {
        const { rows } = await sql`
            UPDATE applications
            SET "companyName" = ${companyName}, role = ${role}, "dateApplied" = ${dateApplied.toISOString()}, status = ${status}, notes = ${notes}
            WHERE id = ${id}
            RETURNING id, "companyName", role, "dateApplied", status, notes;
        `;
        savedApp = ApplicationSchema.parse(rows[0])
    } else {
        const { rows } = await sql`
            INSERT INTO applications (id, "companyName", role, "dateApplied", status, notes)
            VALUES (${id}, ${companyName}, ${role}, ${dateApplied.toISOString()}, ${status}, ${notes})
            RETURNING id, "companyName", role, "dateApplied", status, notes;
        `;
        savedApp = ApplicationSchema.parse(rows[0]);
    }
    revalidatePath('/');
    return savedApp;
}

export async function deleteApplication(id: string): Promise<void> {
  await sql`DELETE FROM applications WHERE id = ${id};`;
  revalidatePath('/');
}

export async function updateApplicationStatus(id: string, status: Status): Promise<void> {
  await sql`UPDATE applications SET status = ${status} WHERE id = ${id};`;
  revalidatePath('/');
}
