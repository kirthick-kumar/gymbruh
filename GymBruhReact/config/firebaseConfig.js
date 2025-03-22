import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOBNwLocqbL-Nevf6x4IoeicMmLki5K4Y",
  authDomain: "gymbruh-8d3cd.firebaseapp.com",
  projectId: "gymbruh-8d3cd",
  storageBucket: "gymbruh-8d3cd.appspot.com",
  messagingSenderId: "377781316840",
  appId: "1:377781316840:android:78ad518125a4858da12d5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
