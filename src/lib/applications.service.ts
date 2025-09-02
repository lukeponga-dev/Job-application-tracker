'use server';

import type { Application, Status } from './types';
import { ApplicationSchema } from './types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { sql } from './db';

export async function getApplications(): Promise<Application[]> {
  try {
    const { rows } = await sql`SELECT id, platform, "companyName", role, "dateApplied", status, notes FROM applications ORDER BY "dateApplied" DESC;`;
    
    const appSchema = z.object({
        id: z.string(),
        platform: z.string().nullable(),
        companyName: z.string(),
        role: z.string(),
        dateApplied: z.date(),
        status: z.enum(["Applied", "Interviewing", "Offer", "Rejected"]),
        notes: z.string().nullable(),
    });

    const applicationsListSchema = z.array(
      appSchema.transform(row => ({
        ...row,
        platform: row.platform ?? "",
        notes: row.notes ?? "",
      }))
    );

    const parsedApplications = applicationsListSchema.safeParse(rows);

    if (!parsedApplications.success) {
      console.error("Failed to parse applications:", parsedApplications.error.flatten());
      return [];
    }

    return parsedApplications.data;
  } catch(error) {
    console.error('Error fetching applications', error)
    return [];
  }
}

export async function saveApplication(application: Omit<Application, 'id'> & { id?: string }): Promise<Application> {
    const appData = {
        ...application,
        id: application.id || crypto.randomUUID(),
    }
    const { id, platform, companyName, role, dateApplied, status, notes } = ApplicationSchema.parse(appData);

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
    
    const parsedApp = ApplicationSchema.parse({
      ...savedApp,
      platform: savedApp.platform ?? "",
      notes: savedApp.notes ?? "",
    });

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
