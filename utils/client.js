// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';

// const firebaseCredentials = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
// };

// const clientCredentials = {
//   ...firebaseCredentials,
//   databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
// };

// if (!firebase.apps.length) {
//   firebase?.initializeApp(firebaseCredentials);
// }

// export { firebase, clientCredentials };

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

console.log("FIREBASE DATABASE URL:", process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const database = getDatabase(app);
// Define client credentials
const clientCredentials = {
  ...firebaseConfig, // Ensure all Firebase env variables are available
};


export { app, auth, database, clientCredentials };