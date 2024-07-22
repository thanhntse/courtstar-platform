import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyDoOrQTTRRdNYN1QRmEXFAi7EFTDcn88Fk",
  authDomain: "courtstar-project.firebaseapp.com",
  projectId: "courtstar-project",
  storageBucket: "courtstar-project.appspot.com",
  messagingSenderId: "602134067285",
  appId: "1:602134067285:web:135a7dbc1f81dd66963cdc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app)