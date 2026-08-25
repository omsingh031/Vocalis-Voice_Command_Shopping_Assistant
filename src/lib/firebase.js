/**
 * Firebase setup — falls back gracefully to local-only mode
 * if no Firebase config is provided (all VITE_ vars empty).
 *
 * This lets the app run immediately after `npm run dev` without
 * any Firebase project setup, while keeping real Firestore sync
 * ready to activate by filling in .env values.
 */

let db = null;
let auth = null;
let functions = null;
let _firebaseReady = false;

try {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

  if (apiKey) {
    const { initializeApp } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');
    const { getAuth, signInAnonymously, onAuthStateChanged } = await import('firebase/auth');
    const { getFunctions } = await import('firebase/functions');

    const firebaseConfig = {
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    functions = getFunctions(app);
    _firebaseReady = true;

    console.log('[firebase] Connected — Firestore sync active.');
  } else {
    console.log('[firebase] No config found — running in local-only mode.');
  }
} catch (err) {
  console.warn('[firebase] Init failed, falling back to local mode:', err.message);
}

export { db, auth, functions };
export const isFirebaseReady = _firebaseReady;

/**
 * Resolves once an anonymous session exists. No-op if Firebase isn't configured.
 */
export async function ensureAnonymousSession() {
  if (!_firebaseReady || !auth) return { uid: 'local-user' };

  const { signInAnonymously, onAuthStateChanged } = await import('firebase/auth');

  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
      }
    }, reject);
    if (!auth.currentUser) {
      signInAnonymously(auth).catch(reject);
    }
  });
}
