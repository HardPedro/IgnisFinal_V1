import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig: any = {};

if (fs.existsSync(configPath)) {
  firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} else {
  // Fallback to environment variables for Render deployment
  firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    firestoreDatabaseId: process.env.FIREBASE_FIRESTORE_DATABASE_ID || '(default)'
  };
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export async function initializeServerAuth() {
  try {
    await signInWithEmailAndPassword(auth, 'server@oficinapro.com', 'ServerSecret123!');
    console.log('Server authenticated with Firebase successfully.');
  } catch (error: any) {
    if (error.code === 'auth/operation-not-allowed') {
      console.error('\n================================================================');
      console.error('CRITICAL ERROR: Email/Password authentication is not enabled.');
      console.error('Please enable Email/Password authentication in the Firebase Console:');
      console.error('1. Go to Authentication -> Sign-in method');
      console.error('2. Enable Email/Password');
      console.error('3. Run `npx tsx setup-server-user.ts` to create the server user.');
      console.error('================================================================\n');
    } else {
      console.error('Failed to authenticate server with Firebase:', error);
    }
  }
}


