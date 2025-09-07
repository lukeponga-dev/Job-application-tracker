'use server';

import { cookies } from 'next/headers';
import { getAdminApp } from './firebase-admin';
import type { User } from './types';
import { getAuth } from 'firebase-admin/auth';
import { getUser, createUser } from './users.service';

export async function getAuthenticatedUser(): Promise<User | null> {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
        return null;
    }
    try {
        const decodedToken = await getAuth(getAdminApp()).verifySessionCookie(sessionCookie, true);
        let user = await getUser(decodedToken.uid);
        if (!user) {
            // If user is not in DB, create them
            const newUser = {
                id: decodedToken.uid,
                email: decodedToken.email!,
                name: decodedToken.name || null,
            };
            user = await createUser(newUser);
        }
        return user;
    } catch (error) {
        console.error('Error verifying session cookie:', error);
        return null;
    }
}
