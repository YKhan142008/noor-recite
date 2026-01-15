// lib/firebase.client.ts
"use client";

import { FirebaseApp, initializeApp, getApps, getApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

const hasKeys =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('placeholder');

if (hasKeys) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (e) {
    console.error('Firebase initialization failed:', e);
  }
} else {
  console.warn('⚠️ Firebase API Keys missing. Auth disabled.');
}

export { app, db, auth };
