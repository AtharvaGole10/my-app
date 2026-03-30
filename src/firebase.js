import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBMfOkViZhr0ZNkaDLhJmFqcu69poMR2bw",
  authDomain: "my-todo-app-d3385.firebaseapp.com",
  projectId: "my-todo-app-d3385",
  storageBucket: "my-todo-app-d3385.firebasestorage.app",
  messagingSenderId: "869959911733",
  appId: "1:869959911733:web:193440c61861416408247c",
  measurementId: "G-6K5TR9YXM5"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, signInWithPopup, signOut, query, where }