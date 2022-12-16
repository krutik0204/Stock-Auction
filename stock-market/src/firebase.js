import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA59q6Po_Wn_3F-lz5h4-un5COlnsbGZPk",
  authDomain: "stock-auction-27.firebaseapp.com",
  projectId: "stock-auction-27",
  storageBucket: "stock-auction-27.appspot.com",
  messagingSenderId: "381134332489",
  appId: "1:381134332489:web:73c54db842108c99275598",
  measurementId: "G-Q1J4H1YTCW",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
