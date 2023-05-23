// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXud8SuZtkTLgRwya4pToPRM2_Q80Up_8",
  authDomain: "laravel-product-list-frontend.firebaseapp.com",
  projectId: "laravel-product-list-frontend",
  storageBucket: "laravel-product-list-frontend.appspot.com",
  messagingSenderId: "337448694277",
  appId: "1:337448694277:web:80181f290c6b167a12a26c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);