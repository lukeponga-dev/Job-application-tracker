'use server';

import type { Application, Status } from './types';
import { ApplicationSchema } from './types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getDb } from './db';
import { getAuthenticatedUser } from './auth';

export async function getApplications(): Promise<Application[]> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return [];
  }
  
  try {
    const sql = await getDb();
    const { rows } = await sql`
      SELECT id, "userId", platform, "companyName", role, "dateApplied", status, notes 
      FROM applications 
      ORDER BY "dateApplied" DESC;
    `;
    
    const appSchema = z.object({
        id: z.string(),
        userId: z.string(),
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

export async function saveApplication(application: Omit<Application, 'id' | 'userId'> & { id?: string }): Promise<Application> {
    const user = await getAuthenticatedUser();
    if (!user) {
        throw new Error("User not authenticated");
    }
    const sql = await getDb();

    const appData = {
        ...application,
        id: application.id || crypto.randomUUID(),
        userId: user.id
    }
    const { id, userId, platform, companyName, role, dateApplied, status, notes } = ApplicationSchema.parse(appData);

    const existing = await sql`SELECT id FROM applications WHERE id = ${id}`;

    let savedApp;
    if (existing.rowCount > 0) {
        const { rows } = await sql`
            UPDATE applications
            SET platform = ${platform}, "companyName" = ${companyName}, role = ${role}, "dateApplied" = ${dateApplied.toISOString().split('T')[0]}, status = ${status}, notes = ${notes}
            WHERE id = ${id}
            RETURNING id, "userId", platform, "companyName", role, "dateApplied", status, notes;
        `;
        savedApp = rows[0]
    } else {
        const { rows } = await sql`
            INSERT INTO applications (id, "userId", platform, "companyName", role, "dateApplied", status, notes)
            VALUES (${id}, ${userId}, ${platform}, ${companyName}, ${role}, ${dateApplied.toISOString().split('T')[0]}, ${status}, ${notes})
            RETURNING id, "userId", platform, "companyName", role, "dateApplied", status, notes;
        `;
        savedApp = rows[0];
    }
    revalidatePath('/');
    
    // The 'dateApplied' comes back as a string from the DB, so we need to parse it.
    const dbAppWithDate = {
      ...savedApp,
      dateApplied: new Date(savedApp.dateApplied),
    };
    
    const parsedApp = ApplicationSchema.parse({
      ...dbAppWithDate,
      platform: dbAppWithDate.platform ?? "",
      notes: dbAppWithDate.notes ?? "",
    });

    return parsedApp;
}


export async function deleteApplication(id: string): Promise<void> {
    const user = await getAuthenticatedUser();
    if (!user) {
        throw new Error("User not authenticated");
    }
    const sql = await getDb();
    await sql`DELETE FROM applications WHERE id = ${id};`;
    revalidatePath('/');
}

export async function updateApplicationStatus(id: string, status: Status): Promise<void> {
    const user = await getAuthenticatedUser();
    if (!user) {
        throw new Error("User not authenticated");
    }
    const sql = await getDb();
    await sql`UPDATE applications SET status = ${status} WHERE id = ${id};`;
    revalidatePath('/');
}
