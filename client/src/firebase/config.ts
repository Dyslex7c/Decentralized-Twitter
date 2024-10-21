// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo62qnczws2aCSNKb3MdzvJ_UkMeOJGI4",
  authDomain: "decentralized-75473.firebaseapp.com",
  projectId: "decentralized-75473",
  storageBucket: "decentralized-75473.appspot.com",
  messagingSenderId: "760086723171",
  appId: "1:760086723171:web:6536f991a76f3529ee5656"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;