import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyAtMPU-9e-jSnt2DCXSby0T_08Psvg8R_A",
  authDomain: "kooliceimage.firebaseapp.com",
  projectId: "kooliceimage",
  storageBucket: "kooliceimage.appspot.com",
  messagingSenderId: "942338686738",
  appId: "1:942338686738:web:a734c7db7160d2b757bdcb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app)