import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBtMB9qs34H8qMjaA_XavJdrUSpOASYBos',
  authDomain: 'ad-diamantina.firebaseapp.com',
  projectId: 'ad-diamantina',
  storageBucket: 'ad-diamantina.firebasestorage.app',
  messagingSenderId: '430449368435',
  appId: '1:430449368435:web:c2d94116f9761fd4c87906'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
