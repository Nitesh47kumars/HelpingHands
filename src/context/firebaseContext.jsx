import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  increment,
  serverTimestamp as rtdbServerTimestamp,
} from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async ({ email, password, fullName, address, dob, phone }) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await set(ref(database, `users/${user.uid}`), {
      uid: user.uid,
      email: user.email,
      fullName,
      address,
      dob,
      phone,
      role: "user",
      karma: 0,
      createdAt: Date.now(),
    });

    return userCredential;
  };

  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const awardKarma = async (helperId, points = 10) => {
    try {
      const userRef = ref(database, `users/${helperId}`);
      await update(userRef, {
        karma: increment(points),
      });
      return true;
    } catch (error) {
      console.error("Error awarding karma:", error);
      return false;
    }
  };

  const getUserKarma = async (userId) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return snapshot.val().karma || 0;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching karma:", error);
      return 0;
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        logout,
        awardKarma,
        getUserKarma,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);