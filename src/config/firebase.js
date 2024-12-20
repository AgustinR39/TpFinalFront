
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// //const analytics = getAnalytics(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC48qllB7K_5TDJN6Y2KI0pH5rX-BcXksY",
  authDomain: "front-52472.firebaseapp.com",
  projectId: "front-52472",
  storageBucket: "front-52472.firebasestorage.app",
  messagingSenderId: "60995715656",
  appId: "1:60995715656:web:227c040274ba4dacb4ce7d",
  measurementId: "G-L2ELYL83LD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);


export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()