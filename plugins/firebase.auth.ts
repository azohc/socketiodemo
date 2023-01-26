import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const firebaseConfig = {
    apiKey: "AIzaSyBDGCaoZmFv2jSoUXkgwQzVyGKuB4Zveg0",
    authDomain: "nuxt-ws-chat.firebaseapp.com",
    projectId: "nuxt-ws-chat",
    storageBucket: "nuxt-ws-chat.appspot.com",
    messagingSenderId: "620325128389",
    appId: "1:620325128389:web:9f77280662a8afd4e588ac",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  nuxtApp.vueApp.provide("auth", auth);
  nuxtApp.provide("auth", auth);
});
