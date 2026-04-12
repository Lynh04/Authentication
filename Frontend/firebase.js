import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBaoAobO44KmHNTcplNCxgcfuanKPeZcfM",
    authDomain: "authentication-557a7.firebaseapp.com",
    projectId: "authentication-557a7",
    storageBucket: "authentication-557a7.firebasestorage.app",
    messagingSenderId: "64843932497",
    appId: "1:64843932497:web:0cbf423edff00a6f862970",
    measurementId: "G-H0QP09VQ0G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();