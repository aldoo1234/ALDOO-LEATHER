import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAJXUIVQA7xcrMy-SuXwqRSviVUazq1BjQ",
  authDomain: "aldoo-leather.firebaseapp.com",
  projectId: "aldoo-leather",
  storageBucket: "aldoo-leather.firebasestorage.app",
  messagingSenderId: "886960659017",
  appId: "1:886960659017:web:854480f1f54f5708583d98"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };