// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBpEChG-BBdNHSyFGx7nyQEtutZhTVc5LQ",
    authDomain: "bitcoinordinalmarketplace.firebaseapp.com",
    projectId: "bitcoinordinalmarketplace",
    storageBucket: "bitcoinordinalmarketplace.appspot.com",
    messagingSenderId: "486747058153",
    appId: "1:486747058153:web:d2df9230cdc249a988e578",
    measurementId: "G-7W74EF7GM5"
  };

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;