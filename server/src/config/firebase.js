// config/firebase.js

// import { initializeApp, cert } from 'firebase-admin/app';
// import { getStorage } from 'firebase-admin/storage';

// import serviceAccount from '../config/firebase-service-account.json' with { type: 'json' };

// const firebaseApp = initializeApp({
//   credential: cert(serviceAccount),
//   storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app'
// });

// const bucket = getStorage(firebaseApp).bucket();

// export { firebaseApp, bucket };

import { cert, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const bucket = getStorage(app).bucket();