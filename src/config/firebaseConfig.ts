// Configuração central do Firebase

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3e3Yijv2g2Vp4MRGn0uhkYaoBBDd6CcA",
  authDomain: "appbarbearia-b30c8.firebaseapp.com",
  projectId: "appbarbearia-b30c8",
  storageBucket: "appbarbearia-b30c8.firebasestorage.app",
  messagingSenderId: "33108730466",
  appId: "1:33108730466:android:eb4f4acae565732a01e73b",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

if (!getApps().length) {
  initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
