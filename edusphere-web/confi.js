// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBK4etmXUUjrmKgu7IP17ikYcJ8243RVVE",
  authDomain: "edusphere-617d0.firebaseapp.com",
  projectId: "edusphere-617d0",
  storageBucket: "edusphere-617d0.firebasestorage.app",
  messagingSenderId: "852099348060",
  appId: "1:852099348060:web:db25755544e48b934b1899",
  measurementId: "G-GRNR99TY0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);