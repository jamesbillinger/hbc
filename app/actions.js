import firebase from 'firebase';
import config from '../config.json';

const firebaseApp = firebase.initializeApp(config.firebase);
const database = firebaseApp.database();
const firebaseRef = database.ref();
const firebaseAuth = firebase.auth;

export function register(email, pw) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then((user) => {
      console.log(user);
    })
    .catch((err) => {
      console.log(err);
    })
}

export function logout() {
  return firebaseAuth().signOut()
}

export function login(email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function resetPassword(email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

export function saveUser(user) {
  return ref.child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user)
}