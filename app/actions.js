import firebase from 'firebase';
import config from '../config.json';

const firebaseApp = firebase.initializeApp(config.firebase);
const database = firebaseApp.database();
const firebaseRef = database.ref();
const firebaseAuth = firebase.auth;

export function register(email, pw) {
  return dispatch => {
    firebaseAuth().createUserWithEmailAndPassword(email, pw)
      .then((user) => {
        console.log(user);
        if (user) {
          dispatch({
            type: 'UPDATE_AUTH',
            user
          });
          if (!user.emailVerified) {
            user.sendEmailVerification();
          }
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: 'UPDATE_AUTH',
          err
        });
      })
  }
}

export function onAuthStateChanged(user) {
  return {
    type: 'UPDATE_AUTH',
    user
  }
}

export function logout() {
  return dispatch => {
    firebaseAuth().signOut()
      .then(() => {
        dispatch({
          type: 'UPDATE_AUTH'
        });
      })
      .catch((err) => {
        console.log(err);
      })
  }
}

export function login(email, pw) {
  return dispatch => {
    firebaseAuth().signInWithEmailAndPassword(email, pw)
      .then((user) => {
        dispatch({
          type: 'UPDATE_AUTH',
          user
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: 'UPDATE_AUTH',
          err
        });
      })
  }
}

export function resetPassword(email) {
  return dispatch => {
    firebaseAuth().sendPasswordResetEmail(email)
  }
}

export function saveUser(user) {
  return dispatch => {
    firebaseRef.child(`users/${user.uid}/info`)
      .set({
        email: user.email,
        uid: user.uid
      })
      .then(() => user)
  }
}