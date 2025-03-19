import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getAuth } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";
// Add AsyncStorage for persistence
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3e3Yijv2g2Vp4MRGn0uhkYaoBBDd6CcA",
  authDomain: "appbarbearia-b30c8.firebaseapp.com",
  projectId: "appbarbearia-b30c8",
  storageBucket: "appbarbearia-b30c8.firebasestorage.app",
  messagingSenderId: "33108730466",
  appId: "1:33108730466:android:eb4f4acae565732a01e73b",
};

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// Inicializa o firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
