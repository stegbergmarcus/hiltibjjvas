import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Replace escaped newlines with real newlines
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
        console.log('Firebase Admin Initialized');
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
    }
}

// Export db safely
export const db = admin.apps.length ? admin.firestore() : {
    collection: () => ({
        doc: () => ({
            set: () => Promise.resolve(),
            get: () => Promise.resolve({ exists: false, data: () => ({}) }),
        }),
        where: () => ({ get: () => Promise.resolve({ empty: true, docs: [] }) }),
        orderBy: () => ({ limit: () => ({ get: () => Promise.resolve({ empty: true, docs: [] }) }) }),
    })
} as unknown as admin.firestore.Firestore;
