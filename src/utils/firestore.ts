// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  runTransaction,
} from "firebase/firestore/lite";
import GlobalGameStats from "../models/globalGameStats";

// This firebase info is actually fine to include like this
const firebaseConfig = {
  apiKey: "AIzaSyAWCPl_Ud5wpoapbRONcKbjiJiXR8Op3ag",
  authDomain: "pacman-59fe9.firebaseapp.com",
  projectId: "pacman-59fe9",
  storageBucket: "pacman-59fe9.appspot.com",
  messagingSenderId: "576929800040",
  appId: "1:576929800040:web:842739c4d9b4722cc980dd",
  measurementId: "G-X0QTDZHEY8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getGlobalData = async () => {
  const globalDataCol = collection(db, "gameInfo");
  const globalDataSnap = await getDocs(globalDataCol);
  const globalGameData = globalDataSnap.docs.map((doc) => doc.data())[0];
  return new GlobalGameStats(
    globalGameData.highScore,
    globalGameData.totalScore,
    globalGameData.totalDotsEaten
  );
};

export const updateGlobalData = async (
  totalDotsEaten: number,
  highScore: number,
  score: number
) => {
  const globalDataDocRef = doc(db, "gameInfo", "gameInfo");
  try {
    const newGlobalData = await runTransaction(db, async (transaction) => {
      const globalDataDoc = await transaction.get(globalDataDocRef);
      if (!globalDataDoc.exists()) {
        throw "Document does not exist";
      }

      const globalData = globalDataDoc.data();
      const newTotalDotsEaten = globalData.totalDotsEaten + totalDotsEaten;
      const newHighScore = Math.max(highScore, globalData.highScore);
      const newTotalScore = (globalData.totalScore += score);

      transaction.update(globalDataDocRef, {
        totalDotsEaten: newTotalDotsEaten,
        highScore: newHighScore,
        totalScore: newTotalScore,
      });
      return new GlobalGameStats(
        newHighScore,
        newTotalScore,
        newTotalDotsEaten
      );
    });
    return newGlobalData;
  } catch (error) {
    console.log(error);
  }
  return null;
};
