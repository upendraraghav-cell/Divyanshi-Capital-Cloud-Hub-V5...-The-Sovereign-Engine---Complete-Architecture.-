import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, collection, doc, setDoc, getDoc, getDocs, updateDoc, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, Timestamp, getDocFromServer } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import config from '../../firebase-applet-config.json';

// Default placeholders
const defaultFirebaseConfig = {
  apiKey: "AIzaSyAj1M_TZzbefYS7mIC1X-aE-VwNCDKpIkY",
  authDomain: "gen-lang-client-0777681344.firebaseapp.com",
  projectId: "gen-lang-client-0777681344",
  storageBucket: "gen-lang-client-0777681344.firebasestorage.app",
  messagingSenderId: "727875024577",
  appId: "1:727875024577:web:81b477fea929c3e4bcc640",
  firestoreDatabaseId: "(default)"
};

interface CustomFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  firestoreDatabaseId?: string;
}

let firebaseConfig: CustomFirebaseConfig = defaultFirebaseConfig;

const allInOneConfig = import.meta.env.VITE_ALL_IN_ONE_CONFIG;
if (allInOneConfig && allInOneConfig !== "{}" && allInOneConfig.startsWith('{')) {
  try {
    firebaseConfig = JSON.parse(allInOneConfig);
  } catch (e) {
    console.error("Failed to parse VITE_ALL_IN_ONE_CONFIG", e);
  }
} else if (import.meta.env.VITE_FIREBASE_API_KEY) {
  // Use individual VITE_ environment variables
  firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || "(default)"
  };
} else if (config && config.apiKey && !config.apiKey.includes('TODO') && !config.apiKey.includes('PLACEHOLDER')) {
  firebaseConfig = config as any;
}

console.log(`[Firebase Engine] Link: [ACTIVE] | Node: ${firebaseConfig.projectId} | DB: ${firebaseConfig.firestoreDatabaseId || 'default'}`);

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Hardened Firestore Initialization with Fallback
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    experimentalForceLongPolling: true,
  }, (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)") ? firebaseConfig.firestoreDatabaseId : undefined);
} catch (e) {
  console.warn("[Neural Bridge] Primary Firestore Init failed, falling back to memory-only.", e);
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  }, (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)") ? firebaseConfig.firestoreDatabaseId : undefined);
}
export const db = firestoreDb;
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();

// Connection Test
async function testConnection(retries = 3) {
  if (firebaseConfig.apiKey.includes('PLACEHOLDER') || firebaseConfig.apiKey.includes('TODO')) {
    return;
  }
  
  try {
    // Check navigator status first to prevent unnecessary network calls
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;
    
    // Perform a silent background check without throwing user-facing errors
    await getDocFromServer(doc(db, 'test', 'connection')).catch(() => {
      // Internal catch to prevent bubbling to global interceptors
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline') && retries > 0) {
      setTimeout(() => testConnection(retries - 1), 5000);
    }
  }
}
testConnection();

export { signInWithPopup, onAuthStateChanged, collection, doc, setDoc, getDoc, getDocs, updateDoc, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, Timestamp, ref, uploadBytes, getDownloadURL };
export type { FirebaseUser };

// Error handling helper as per instructions
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const isOffline = errorMessage.toLowerCase().includes('offline') || errorMessage.toLowerCase().includes('client is offline');

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }

  // If we are offline, just log a silent debug message and return.
  if (isOffline) {
    // We use debug instead of warn to be as quiet as possible while still aiding in development if needed
    console.debug(`[Neural Bridge] Connectivity status: OFFLINE for ${operationType} on ${path}. Protocol in wait-state.`);
    return;
  }

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * A wrapper for getDoc that handles offline gracefully
 */
export async function safeGetDoc(docRef: any) {
  try {
    return await getDoc(docRef);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.toLowerCase().includes('offline')) {
      console.debug("[Neural Bridge] safeGetDoc: Network down, skipping retrieval.");
      return { exists: () => false, data: () => null }; // Mock a null/non-existent doc
    }
    throw error;
  }
}

/**
 * A wrapper for getDocs that handles offline gracefully
 */
export async function safeGetDocs(queryRef: any) {
  try {
    return await getDocs(queryRef);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.toLowerCase().includes('offline')) {
      console.debug("[Neural Bridge] safeGetDocs: Network down, skipping retrieval.");
      return { empty: true, forEach: () => {}, docs: [] }; // Mock empty query result
    }
    throw error;
  }
}
