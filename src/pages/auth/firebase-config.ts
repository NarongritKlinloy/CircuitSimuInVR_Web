// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzYQw-qxjmRzzzV54WWughnexQehUqESw",
  authDomain: "circuitsimulatoronvr-681f7.firebaseapp.com",
  projectId: "circuitsimulatoronvr-681f7",
  storageBucket: "circuitsimulatoronvr-681f7.firebasestorage.app",
  messagingSenderId: "540916111778",
  appId: "1:540916111778:web:f44f42f64b3fdb98defafb",
  measurementId: "G-SMPFPNPCXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);