import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// You should populate this with your own Firebase project configuration
const firebaseConfig = {
  apiKey: "pck_caeqhrx2emdh722882b5syyy3a1d9prdext0fas9f0e9r",
  authDomain: "5d464cca-638b-455d-9428-f5116a043334.firebaseapp.com",
  projectId: "5d464cca-638b-455d-9428-f5116a043334",
  storageBucket: "5d464cca-638b-455d-9428-f5116a043334.appspot.com",
  messagingSenderId: "", // Optional, can be left empty
  appId: "", // Optional, can be left empty
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
