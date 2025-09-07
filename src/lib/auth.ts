'use server';

import { headers } from 'next/headers';
import { getAdminApp } from './firebase-admin';
import type { User } from './types';
import { getAuth } from 'firebase-admin/auth';
import { getUser, createUser } from './users.service';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { URL } from 'url';

export async function getAuthenticatedUser(): Promise<User | null> {
    const authHeader = headers().get('Authorization');
    if (!authHeader) {
        console.error('No authorization header found');
        return null;
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
        console.error('No token found in authorization header');
        return null;
    }

    try {
        const jwksUri = new URL(`https://api.stack-auth.com/api/v1/projects/${process.env.NEXT_PUBLIC_STACK_PROJECT_ID}/.well-known/jwks.json`);
        const JWKS = createRemoteJWKSet(jwksUri);
        const { payload } = await jwtVerify(token, JWKS);

        const decodedToken = await getAuth(getAdminApp()).verifyIdToken(token, true);

        let user = await getUser(decodedToken.uid);
        if (!user) {
            const newUser = {
                id: decodedToken.uid,
                email: decodedToken.email!,
                name: decodedToken.name || null,
            };
            user = await createUser(newUser);
        }
        return user;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}
