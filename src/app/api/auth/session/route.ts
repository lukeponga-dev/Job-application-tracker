import { getAdminApp } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json({ error: 'idToken is required' }, { status: 400 });
  }

  // We are not setting a session cookie anymore with RLS.
  // We just return success if the token is valid, so the client can store it.
  try {
    const app = getAdminApp();
    await getAuth(app).verifyIdToken(idToken);
    
    // The client will now be responsible for storing the idToken and sending it
    // in the Authorization header for subsequent requests.
    return NextResponse.json({ success: true, token: idToken });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Failed to verify token' }, { status: 401 });
  }
}
