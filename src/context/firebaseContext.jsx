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
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeJAbP5P_k0n7Q-IUlojqStnYJwErcxk0",
  authDomain: "helpinghands-ad3d8.firebaseapp.com",
  databaseURL: "https://helpinghands-ad3d8-default-rtdb.firebaseio.com",
  projectId: "helpinghands-ad3d8",
  storageBucket: "helpinghands-ad3d8.firebasestorage.app",
  messagingSenderId: "311489203311",
  appId: "1:311489203311:web:b532f5f233cfa38421119a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const createHelpRequest = async ({ title, description }) => {
    if (!user) return;
    return addDoc(collection(db, "helpRequests"), {
      title,
      description,
      userId: user.uid,
      status: "open",
      createdAt: serverTimestamp(),
    });
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        logout,
        createHelpRequest,
      }}
    >
      {!loading && children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
