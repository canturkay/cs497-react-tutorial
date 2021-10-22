import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { useState, useEffect, } from 'react';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';
const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

export const useUserState = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    onIdTokenChanged(getAuth(firebase), setUser);
  }, []);

  return [user];
};


const firebaseConfig = {
    apiKey: "AIzaSyBTyhp8njdEM4JOl0QtQC7RxIu3HMuIYT8",
    authDomain: "cs497-4719b.firebaseapp.com",
    databaseURL: "https://cs497-4719b-default-rtdb.firebaseio.com",
    projectId: "cs497-4719b",
    storageBucket: "cs497-4719b.appspot.com",
    messagingSenderId: "877669390799",
    appId: "1:877669390799:web:87a171ea785b1171841aba",
    measurementId: "G-6J4DDGYFFM"
  };

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const useData = (path, transform) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const dbRef = ref(database, path);
    const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    if (devMode) { console.log(`loading ${path}`); }
    return onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      if (devMode) { console.log(val); }
      setData(transform ? transform(val) : val);
      setLoading(false);
      setError(null);
    }, (error) => {
      setData(null);
      setLoading(false);
      setError(error);
    });
  }, [path, transform]);

  return [data, loading, error];
};

export const setData = (path, value) => (
  set(ref(database, path), value)
);