// Guestbook entries and the visitor counter.
// Uses the same Firebase project as DevFeed; without Firebase config (local
// dev) both fall back to this browser's localStorage.
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, collection, query, orderBy, limit, onSnapshot, addDoc,
  serverTimestamp, doc, getDoc, setDoc, updateDoc, increment,
} from 'firebase/firestore';

const env = import.meta.env;
const firebaseConfig = {
  apiKey:            env.VITE_FIREBASE_API_KEY,
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.VITE_FIREBASE_APP_ID,
};
const isShared = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export const NAME_MAX = 30;
export const MESSAGE_MAX = 300;
const COUNTED_KEY = 'visitorCounted';
const NUMBER_KEY = 'visitorNumber';

function savedNumber() {
  try { return Number(localStorage.getItem(NUMBER_KEY)) || null; } catch { return null; }
}
function saveNumber(n) {
  try { localStorage.setItem(NUMBER_KEY, String(n)); localStorage.setItem(COUNTED_KEY, '1'); } catch {}
}

function formatDate(ts) {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : new Date();
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function clean(name, message) {
  const n = String(name || '').trim().slice(0, NAME_MAX);
  const m = String(message || '').trim().slice(0, MESSAGE_MAX);
  if (!n || !m) throw new Error('Please fill in your name and a message.');
  return { name: n, message: m };
}

function createFirestoreStore() {
  const app = getApps()[0] || initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const entries = collection(db, 'guestbook');
  const counter = doc(db, 'stats', 'visitors');

  return {
    subscribeGuestbook(onEntries, onError) {
      const q = query(entries, orderBy('createdAt', 'desc'), limit(100));
      return onSnapshot(q, snap => {
        onEntries(snap.docs.map(d => ({ id: d.id, ...d.data(), date: formatDate(d.data().createdAt) })));
      }, onError);
    },
    async signGuestbook(name, message) {
      await addDoc(entries, { ...clean(name, message), createdAt: serverTimestamp() });
    },
    // Counts each browser once and returns { number, total }: the visitor's
    // own number (remembered in this browser) and the current total.
    async visit() {
      let counted = false;
      try { counted = localStorage.getItem(COUNTED_KEY) === '1'; } catch {}
      if (!counted) {
        try {
          await updateDoc(counter, { count: increment(1) });
        } catch (err) {
          if (err.code !== 'not-found') throw err;
          await setDoc(counter, { count: 1 });
        }
      }
      const snap = await getDoc(counter);
      const total = snap.data()?.count || 0;
      if (!counted) saveNumber(total);
      return { number: savedNumber() || total, total };
    },
  };
}

function createLocalStore() {
  const KEY = 'guestbook_entries';
  const listeners = new Set();
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const emit = () => listeners.forEach(fn => fn(read()));
  return {
    subscribeGuestbook(onEntries) {
      listeners.add(onEntries);
      onEntries(read());
      return () => listeners.delete(onEntries);
    },
    async signGuestbook(name, message) {
      const entry = { id: String(Date.now()), ...clean(name, message), date: formatDate() };
      try { localStorage.setItem(KEY, JSON.stringify([entry, ...read()])); } catch {}
      emit();
    },
    async visit() {
      let total = 0;
      try {
        total = Number(localStorage.getItem('visitorCountLocal') || 0);
        if (localStorage.getItem(COUNTED_KEY) !== '1') {
          total += 1;
          localStorage.setItem('visitorCountLocal', String(total));
          saveNumber(total);
        }
      } catch {}
      return { number: savedNumber() || total, total };
    },
  };
}

export const communityStore = isShared ? createFirestoreStore() : createLocalStore();
