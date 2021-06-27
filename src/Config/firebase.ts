import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAGElw_m3PBXumHriU2T3fnYEDmwU7xX-c',
  authDomain: 'myappt51.firebaseapp.com',
  databaseURL: 'https://myappt51.firebaseio.com',
  projectId: 'myappt51',
  storageBucket: 'myappt51.appspot.com',
  messagingSenderId: '761028968124',
  appId: '1:761028968124:web:3c57439da0503b0fa15ab9',
  measurementId: 'G-2C85B3XJFM',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

//data

export const db = firebase.firestore();
export const auth = firebase.auth();
