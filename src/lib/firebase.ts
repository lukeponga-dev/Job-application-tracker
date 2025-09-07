import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAioUFzEdlHwkP0ywRGuZdSe1mnMxx6tPI",
  authDomain: "jobtrack-pro-2ixz2.firebaseapp.com",
  projectId: "jobtrack-pro-2ixz2",
  storageBucket: "jobtrack-pro-2ixz2.appspot.com",
  messagingSenderId: "1087971918693",
  appId: "1:1087971918693:web:1352445a97145f0300978c"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
