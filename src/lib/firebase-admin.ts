import * as admin from 'firebase-admin';
import { config } from 'dotenv';

config();

// This is a workaround for Vercel/Next.js issue with replacing private key newline characters
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: privateKey,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

let app: admin.app.App;

export function getAdminApp() {
    if (!app) {
        if (admin.apps.length === 0) {
            app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } else {
            app = admin.app();
        }
    }
    return app;
}
