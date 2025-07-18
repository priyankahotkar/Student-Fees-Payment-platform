// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKCSdyIiho4uFzMgj_5sxRWFLK2gDK7y4",
  authDomain: "studentpay-14810.firebaseapp.com",
  projectId: "studentpay-14810",
  storageBucket: "studentpay-14810.firebasestorage.app",
  messagingSenderId: "141632823105",
  appId: "1:141632823105:web:e7594fe0dc324780efcbc0",
  measurementId: "G-DH2856TED3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; 