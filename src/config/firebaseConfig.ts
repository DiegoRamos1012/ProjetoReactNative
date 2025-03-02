import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Substitua os valores abaixo pelas informações do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC3e3Yijv2g2Vp4MRGn0uhkYaoBBDd6CcA", // sua apiKey
  authDomain: "appbarbearia-b30c8.firebaseapp.com",
  projectId: "appbarbearia-b30c8",
  storageBucket: "appbarbearia-b30c8.firebasestorage.app",
  messagingSenderId: "33108730466",
  appId: "1:33108730466:android:eb4f4acae565732a01e73b",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
