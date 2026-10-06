// Guestbook entries, the Paint gallery, the visitor counter and the visitor map.
// Uses the same Firebase project as DevFeed; without Firebase config (local
// dev) both fall back to this browser's localStorage.
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, collection, query, orderBy, limit, onSnapshot, addDoc,
  serverTimestamp, doc, getDoc, setDoc, updateDoc, increment, deleteDoc,
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
export const CAPTION_MAX = 200;
export const SCRAP_SRC_MAX = 900000;

export const MESSAGE_MAX = 300;
export const IMAGE_MAX = 150000;
const COUNTRY_KEY = 'visitorCountry';

function cleanPicture(name, image) {
  const n = String(name || '').trim().slice(0, NAME_MAX);
  if (!n) throw new Error('Please sign your drawing with a name.');
  if (!String(image).startsWith('data:image/png;base64,')) throw new Error('That drawing could not be saved.');
  if (image.length > IMAGE_MAX) throw new Error('That drawing is too detailed to save. Try fewer colors.');
  return { name: n, image };
}

// Looks up the visitor's country (two-letter code only, nothing else is kept).
async function lookUpCountry() {
  const sources = [
    ['https://api.country.is/', d => d.country],
    ['https://ipapi.co/json/', d => d.country_code],
  ];
  for (const [url, pick] of sources) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const code = String(pick(await res.json()) || '').toUpperCase();
      if (/^[A-Z]{2}$/.test(code)) return code;
    } catch {}
  }
  return null;
}
const COUNTED_KEY = 'visitorCounted';
const NUMBER_KEY = 'visitorNumber';
// Every visit (once per browser session) adds one to the total.
const SESSION_KEY = 'visitCountedThisSession';
function countedThisSession() {
  try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
}
function markSessionCounted() {
  try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
}

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

// Scrapbook posts: a picture, GIF, video or YouTube link, or plain text, plus a caption.
const SCRAP_KINDS = ['image', 'video', 'youtube', 'text'];
function cleanScrap({ kind, src, caption, tag }) {
  if (!SCRAP_KINDS.includes(kind)) throw new Error('Unknown post type.');
  const clean = {
    kind,
    src: kind === 'text' ? '' : String(src || '').trim(),
    caption: String(caption || '').trim().slice(0, CAPTION_MAX),
    tag: String(tag || '').trim().replace(/^#*/, '').slice(0, 20),
  };
  if (kind !== 'text' && !clean.src) throw new Error('Please add a picture or a link.');
  if (clean.src.length > SCRAP_SRC_MAX) throw new Error('That picture is too big.');
  if (kind === 'text' && !clean.caption) throw new Error('Please write something.');
  return clean;
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
    deleteGuestbookEntry: id => deleteDoc(doc(db, 'guestbook', id)),
    subscribeGallery(onPictures, onError) {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(60));
      return onSnapshot(q, snap => {
        onPictures(snap.docs.map(d => ({ id: d.id, ...d.data(), date: formatDate(d.data().createdAt) })));
      }, onError);
    },
    async postPicture(name, image) {
      await addDoc(collection(db, 'gallery'), { ...cleanPicture(name, image), createdAt: serverTimestamp() });
    },
    deletePicture: id => deleteDoc(doc(db, 'gallery', id)),
    subscribeScrapbook(onPosts, onError) {
      const q = query(collection(db, 'scrapbook'), orderBy('createdAt', 'desc'), limit(40));
      return onSnapshot(q, snap => {
        onPosts(snap.docs.map(d => ({ id: d.id, ...d.data(), date: formatDate(d.data().createdAt) })));
      }, onError);
    },
    addScrapbookPost: post => addDoc(collection(db, 'scrapbook'), { ...cleanScrap(post), createdAt: serverTimestamp() }),
    deleteScrapbookPost: id => deleteDoc(doc(db, 'scrapbook', id)),
    // Adds this browser's country to the map once.
    async recordCountry() {
      try { if (localStorage.getItem(COUNTRY_KEY)) return; } catch {}
      const code = await lookUpCountry();
      if (!code) return;
      const ref = doc(db, 'visitor_countries', code);
      try {
        await updateDoc(ref, { count: increment(1) });
      } catch (err) {
        // The rules reject an update on a missing doc, so that shows up as
        // permission-denied rather than not-found.
        if (err.code !== 'not-found' && err.code !== 'permission-denied') throw err;
        await setDoc(ref, { count: 1 });
      }
      try { localStorage.setItem(COUNTRY_KEY, code); } catch {}
    },
    subscribeCountries(onCounts, onError) {
      return onSnapshot(collection(db, 'visitor_countries'), snap => {
        const counts = {};
        snap.docs.forEach(d => { counts[d.id] = d.data().count || 0; });
        onCounts(counts);
      }, onError);
    },
    // Counts each browser once and returns { number, total }: the visitor's
    // own number (remembered in this browser) and the current total.
    async visit() {
      let counted = false;
      try { counted = localStorage.getItem(COUNTED_KEY) === '1'; } catch {}
      const isNew = !countedThisSession();
      if (isNew) {
        markSessionCounted();
        try {
          await updateDoc(counter, { count: increment(1) });
        } catch (err) {
          // The rules reject an update on a missing doc, so that shows up as
          // permission-denied rather than not-found.
          if (err.code !== 'not-found' && err.code !== 'permission-denied') throw err;
          await setDoc(counter, { count: 1 });
        }
      }
      const snap = await getDoc(counter);
      const total = snap.data()?.count || 0;
      if (!counted) saveNumber(total);
      return { number: savedNumber() || total, total, isNew };
    },
  };
}

function createLocalStore() {
  const KEY = 'guestbook_entries';
  const listeners = new Set();
  const galleryListeners = new Set();
  const scrapListeners = new Set();
  const readScrap = () => { try { return JSON.parse(localStorage.getItem('scrapbook_local')) || []; } catch { return []; } };
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
    async deleteGuestbookEntry(id) {
      try { localStorage.setItem(KEY, JSON.stringify(read().filter(e => e.id !== id))); } catch {}
      emit();
    },
    subscribeGallery(onPictures) {
      const list = () => { try { return JSON.parse(localStorage.getItem('gallery_local')) || []; } catch { return []; } };
      galleryListeners.add(onPictures);
      onPictures(list());
      return () => galleryListeners.delete(onPictures);
    },
    async postPicture(name, image) {
      const list = (() => { try { return JSON.parse(localStorage.getItem('gallery_local')) || []; } catch { return []; } })();
      const next = [{ id: String(Date.now()), ...cleanPicture(name, image), date: formatDate() }, ...list].slice(0, 20);
      try { localStorage.setItem('gallery_local', JSON.stringify(next)); } catch {}
      galleryListeners.forEach(fn => fn(next));
    },
    async deletePicture(id) {
      const list = (() => { try { return JSON.parse(localStorage.getItem('gallery_local')) || []; } catch { return []; } })();
      const next = list.filter(p => p.id !== id);
      try { localStorage.setItem('gallery_local', JSON.stringify(next)); } catch {}
      galleryListeners.forEach(fn => fn(next));
    },
    subscribeScrapbook(onPosts) {
      scrapListeners.add(onPosts);
      onPosts(readScrap());
      return () => scrapListeners.delete(onPosts);
    },
    async addScrapbookPost(post) {
      const next = [{ id: String(Date.now()), ...cleanScrap(post), date: formatDate() }, ...readScrap()].slice(0, 20);
      try { localStorage.setItem('scrapbook_local', JSON.stringify(next)); } catch {}
      scrapListeners.forEach(fn => fn(next));
    },
    async deleteScrapbookPost(id) {
      const next = readScrap().filter(p => p.id !== id);
      try { localStorage.setItem('scrapbook_local', JSON.stringify(next)); } catch {}
      scrapListeners.forEach(fn => fn(next));
    },
    async recordCountry() {
      try {
        if (localStorage.getItem(COUNTRY_KEY)) return;
        const code = await lookUpCountry();
        if (!code) return;
        const counts = JSON.parse(localStorage.getItem('countries_local') || '{}');
        counts[code] = (counts[code] || 0) + 1;
        localStorage.setItem('countries_local', JSON.stringify(counts));
        localStorage.setItem(COUNTRY_KEY, code);
      } catch {}
    },
    subscribeCountries(onCounts) {
      try { onCounts(JSON.parse(localStorage.getItem('countries_local') || '{}')); } catch { onCounts({}); }
      return () => {};
    },
    async visit() {
      let total = 0;
      const isNew = !countedThisSession();
      try {
        total = Number(localStorage.getItem('visitorCountLocal') || 0);
        if (isNew) {
          markSessionCounted();
          total += 1;
          localStorage.setItem('visitorCountLocal', String(total));
        }
        if (localStorage.getItem(COUNTED_KEY) !== '1') saveNumber(total);
      } catch {}
      return { number: savedNumber() || total, total, isNew };
    },
  };
}

export const communityStore = isShared ? createFirestoreStore() : createLocalStore();
