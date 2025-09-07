import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// You should populate this with your own Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_STACK_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  storageBucket: `${process.env.NEXT_PUBLIC_STACK_PROJECT_ID}.appspot.com`,
  messagingSenderId: "", // Optional, can be left empty
  appId: "", // Optional, can be left empty
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
