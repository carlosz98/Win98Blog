// DevFeed storage.
// When the VITE_FIREBASE_* env vars are set, posts live in Firestore so every
// visitor sees the same feed and the admin signs in with Google.
// Without them it falls back to this browser's localStorage (dev only).
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, query, orderBy, onSnapshot, addDoc, deleteDoc,
  doc, updateDoc, increment, arrayUnion, arrayRemove, serverTimestamp,
  getDocs, writeBatch, connectFirestoreEmulator,
} from 'firebase/firestore';
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, connectAuthEmulator,
} from 'firebase/auth';

const env = import.meta.env;
const firebaseConfig = {
  apiKey:            env.VITE_FIREBASE_API_KEY,
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.VITE_FIREBASE_APP_ID,
};
const ADMIN_EMAIL = (env.VITE_DEVFEED_ADMIN_EMAIL || '').toLowerCase();

export const isShared = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const LOCAL_KEY = 'devfeed_posts';
const LOCAL_PASSWORD = 'carlosz98'; // local fallback only; shared mode uses Google sign-in

function formatTime(ts) {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : new Date();
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function normalize(p) {
  return { ...p, tags: p.tags || [], likedBy: p.likedBy || [], comments: p.comments || [], likes: p.likes || 0 };
}

// ── Firestore backend ──
function createFirestoreStore() {
  const app  = initializeApp(firebaseConfig);
  const db   = getFirestore(app);
  const auth = getAuth(app);
  if (env.VITE_FIREBASE_EMULATOR === 'true') {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  }
  const postsCol = collection(db, 'devfeed_posts');
  const isAdminUser = u => Boolean(u && u.emailVerified && u.email?.toLowerCase() === ADMIN_EMAIL);

  return {
    subscribe(onPosts, onError) {
      const q = query(postsCol, orderBy('createdAt', 'desc'));
      return onSnapshot(q, snap => {
        onPosts(snap.docs.map(d => {
          const data = d.data();
          return normalize({ ...data, id: d.id, time: formatTime(data.createdAt) });
        }));
      }, onError);
    },
    onAdminChange(cb) {
      return onAuthStateChanged(auth, u => cb(isAdminUser(u)));
    },
    async login() {
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
      if (!isAdminUser(user)) {
        await signOut(auth);
        throw new Error('That Google account is not the DevFeed admin.');
      }
    },
    logout: () => signOut(auth),
    async seedIfEmpty(seedPosts) {
      const existing = await getDocs(postsCol);
      if (!existing.empty) return;
      const batch = writeBatch(db);
      seedPosts.forEach((p, i) => {
        // eslint-disable-next-line no-unused-vars
        const { id, time, ...rest } = p;
        batch.set(doc(postsCol), { ...rest, createdAt: new Date(Date.now() - (i + 1) * 3600e3) });
      });
      await batch.commit();
    },
    addPost: post => addDoc(postsCol, { ...post, likes: 0, likedBy: [], comments: [], createdAt: serverTimestamp() }),
    deletePost: post => deleteDoc(doc(postsCol, post.id)),
    toggleLike(post, userId) {
      const liked = post.likedBy.includes(userId);
      return updateDoc(doc(postsCol, post.id), {
        likes: increment(liked ? -1 : 1),
        likedBy: liked ? arrayRemove(userId) : arrayUnion(userId),
      });
    },
    addComment: (post, comment) => updateDoc(doc(postsCol, post.id), { comments: arrayUnion(comment) }),
    deleteComment: (post, comment) => updateDoc(doc(postsCol, post.id), { comments: arrayRemove(comment) }),
  };
}

// ── localStorage backend ──
function createLocalStore() {
  const listeners = new Set();
  let seed = [];

  function read() {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      return saved ? JSON.parse(saved).map(normalize) : seed;
    } catch { return seed; }
  }
  function write(fn) {
    const next = fn(read());
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(next)); }
    catch (e) { console.error('Failed to save posts', e); }
    listeners.forEach(cb => cb(next));
  }
  const mapPost = (id, fn) => write(posts => posts.map(p => (p.id === id ? fn(p) : p)));

  return {
    subscribe(onPosts, onError, seedPosts = []) {
      seed = seedPosts;
      listeners.add(onPosts);
      onPosts(read());
      return () => listeners.delete(onPosts);
    },
    onAdminChange(cb) {
      cb(sessionStorage.getItem('df_admin') === 'true');
      return () => {};
    },
    async login(password) {
      if (password !== LOCAL_PASSWORD) throw new Error('Incorrect password.');
      sessionStorage.setItem('df_admin', 'true');
    },
    async logout() { sessionStorage.removeItem('df_admin'); },
    async seedIfEmpty() {},
    async addPost(post) {
      write(posts => [{ ...post, id: Date.now(), time: formatTime(), likes: 0, likedBy: [], comments: [] }, ...posts]);
    },
    async deletePost(post) { write(posts => posts.filter(p => p.id !== post.id)); },
    async toggleLike(post, userId) {
      mapPost(post.id, p => {
        const liked = p.likedBy.includes(userId);
        return {
          ...p,
          likes: liked ? p.likes - 1 : p.likes + 1,
          likedBy: liked ? p.likedBy.filter(id => id !== userId) : [...p.likedBy, userId],
        };
      });
    },
    async addComment(post, comment) { mapPost(post.id, p => ({ ...p, comments: [...p.comments, comment] })); },
    async deleteComment(post, comment) {
      mapPost(post.id, p => ({ ...p, comments: p.comments.filter(c => c.id !== comment.id) }));
    },
  };
}

export const devfeedStore = isShared ? createFirestoreStore() : createLocalStore();
