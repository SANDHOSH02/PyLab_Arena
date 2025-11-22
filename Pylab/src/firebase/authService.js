import { auth, db } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const registerUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required to register.");
  }

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", res.user.uid), {
      email,
      role: "user",
    });

    return res;
  } catch (err) {
    // Provide a clearer, actionable message for the common configuration error
    if (err && err.code === "auth/configuration-not-found") {
      throw new Error(
        "Firebase configuration error (auth/configuration-not-found): please enable the Email/Password sign-in method in your Firebase Console (Authentication → Sign-in method). Also verify your `src/firebase/config.js` contains the correct project credentials (apiKey, authDomain, projectId)."
      );
    }

    throw err;
  }
};

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const isAdmin = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return false;
  return snap.data().role === "admin";
};
