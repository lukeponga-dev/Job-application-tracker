'use server';

import { sql } from './db';
import type { User } from './types';
import { UserSchema } from './types';
import { z } from 'zod';


export async function getUser(id: string): Promise<User | null> {
    try {
        const { rows } = await sql`SELECT id, email, name, "createdAt" FROM users WHERE id = ${id};`;
        if (rows.length === 0) {
            return null;
        }

        const userParse = UserSchema.safeParse(rows[0]);
        if (!userParse.success) {
            console.error("Failed to parse user:", userParse.error.flatten());
            return null;
        }
        return userParse.data;

    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export async function createUser(user: Omit<User, 'createdAt'>): Promise<User> {
    const { id, email, name } = user;
    const { rows } = await sql`
        INSERT INTO users (id, email, name)
        VALUES (${id}, ${email}, ${name})
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            name = EXCLUDED.name
        RETURNING id, email, name, "createdAt";
    `;

    const userParse = UserSchema.safeParse(rows[0]);
    if (!userParse.success) {
        console.error("Failed to parse created user:", userParse.error.flatten());
        throw new Error("Failed to create or update user.");
    }
    return userParse.data;
}
