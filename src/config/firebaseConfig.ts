import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Substitua os valores abaixo pelas informações do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyExampleXYZ", // sua apiKey
  authDomain: "projetoreactnative.firebaseapp.com",
  projectId: "projetoreactnative",
  storageBucket: "projetoreactnative", // se necessário, ajuste para "projetoreactnative.appspot.com"
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
