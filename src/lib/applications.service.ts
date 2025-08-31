'use server';

import { sql } from '@vercel/postgres';
import type { Application, Status } from './types';
import { ApplicationSchema } from './types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ApplicationDBSchema = ApplicationSchema.extend({
  companyname: z.string(),
  dateapplied: z.date(),
}).omit({ companyName: true, dateApplied: true });

function fromDb(app: z.infer<typeof ApplicationDBSchema>): Application {
    return {
        id: app.id,
        companyName: app.companyname,
        role: app.role,
        dateApplied: app.dateapplied,
        status: app.status,
        notes: app.notes,
    }
}

export async function getApplications(): Promise<Application[]> {
  const { rows } = await sql`SELECT * FROM applications ORDER BY "dateApplied" DESC;`;
  return rows.map(row => fromDb(ApplicationDBSchema.parse(row)));
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
            RETURNING *;
        `;
        savedApp = fromDb(ApplicationDBSchema.parse(rows[0]));
    } else {
        const { rows } = await sql`
            INSERT INTO applications (id, "companyName", role, "dateApplied", status, notes)
            VALUES (${id}, ${companyName}, ${role}, ${dateApplied.toISOString()}, ${status}, ${notes})
            RETURNING *;
        `;
        savedApp = fromDb(ApplicationDBSchema.parse(rows[0]));
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
