import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import dotenv from 'dotenv';
dotenv.config()

require('dotenv').config()

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAp43XrPBDJys4rUfmpxlgict-imHNIdrE",
//   authDomain: "image-community-9bfa8.firebaseapp.com",
//   projectId: "image-community-9bfa8",
//   storageBucket: "image-community-9bfa8.appspot.com",
//   messagingSenderId: "707637642730",
//   appId: "1:707637642730:web:470c976c598ce6d8541e93",
//   measurementId: "G-TW3F5KN2JE"
// };

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage(); 

export{auth, apiKey, firestore, storage};