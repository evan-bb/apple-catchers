// ── Firebase: accounts + leaderboard ──────────────
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDpqY9sPzcmtCdSZfkWlXA1pxPACm9Re1o",
  authDomain: "apple-catchers.firebaseapp.com",
  projectId: "apple-catchers",
  storageBucket: "apple-catchers.firebasestorage.app",
  messagingSenderId: "531631868342",
  appId: "1:531631868342:web:50c4002485a98a760d9917"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ── Helpers ───────────────────────────────────────
function friendlyError(code) {
  switch (code) {
    case 'auth/email-already-in-use':   return 'That username is already taken!';
    case 'auth/wrong-password':         return 'Wrong password, try again!';
    case 'auth/invalid-credential':     return 'Wrong username or password!';
    case 'auth/user-not-found':         return 'No account with that username!';
    case 'auth/weak-password':          return 'Password must be at least 6 characters!';
    case 'auth/too-many-requests':      return 'Too many tries, wait a bit!';
    case 'auth/network-request-failed': return 'No internet connection!';
    default:                            return 'Something went wrong, try again!';
  }
}

// Turn username into a fake email for Firebase Auth
function toEmail(username) {
  return username.toLowerCase().trim() + '@apple-catchers.firebaseapp.com';
}

// ── Sign Up ───────────────────────────────────────
export async function signUp(username, password) {
  // Validate username
  const name = username.trim();
  if (name.length < 3 || name.length > 15) {
    return { ok: false, error: 'Username must be 3-15 characters!' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    return { ok: false, error: 'Letters, numbers, and _ only!' };
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, toEmail(name), password);
    await updateProfile(cred.user, { displayName: name });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyError(e.code) };
  }
}

// ── Log In ────────────────────────────────────────
export async function logIn(username, password) {
  try {
    await signInWithEmailAndPassword(auth, toEmail(username), password);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyError(e.code) };
  }
}

// ── Log Out ───────────────────────────────────────
export async function logOut() {
  try { await signOut(auth); } catch (e) {}
}

// ── Auth State Listener ───────────────────────────
export function onAuthChange(callback) {
  onAuthStateChanged(auth, callback);
}

// ── Save Score (only keeps your best per mode) ───
export async function saveScore(score, mode) {
  if (!auth.currentUser) return;
  const finalScore = Math.floor(score);
  try {
    // Each player gets one doc per mode: "userId_mode"
    const docId = auth.currentUser.uid + '_' + mode;
    const ref = doc(db, 'scores', docId);
    const existing = await getDoc(ref);

    // Only save if it's a new high score
    if (existing.exists() && existing.data().score >= finalScore) return;

    await setDoc(ref, {
      userId: auth.currentUser.uid,
      username: auth.currentUser.displayName,
      score: finalScore,
      mode: mode,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error('Score save failed:', e);
  }
}

// ── Save Progress to Cloud ────────────────────────
export async function saveProgress(saveData) {
  if (!auth.currentUser) return;
  try {
    await setDoc(doc(db, 'progress', auth.currentUser.uid), {
      save: JSON.parse(JSON.stringify(saveData)),
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error('Progress save failed:', e);
  }
}

// ── Load Progress from Cloud ─────────────────────
export async function loadProgress() {
  if (!auth.currentUser) return null;
  try {
    const snap = await getDoc(doc(db, 'progress', auth.currentUser.uid));
    if (snap.exists()) return snap.data().save;
    return null;
  } catch (e) {
    console.error('Progress load failed:', e);
    return null;
  }
}

// ── Get Leaderboard ───────────────────────────────
export async function getLeaderboard(mode) {
  try {
    const q = query(
      collection(db, 'scores'),
      where('mode', '==', mode),
      orderBy('score', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch (e) {
    console.error('Leaderboard load failed:', e);
    return [];
  }
}
