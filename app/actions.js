import firebase from 'firebase';
import config from '../config.json';

const firebaseApp = firebase.initializeApp(config.firebase);
const database = firebaseApp.database();
const firebaseRef = database.ref();
const firebaseAuth = firebase.auth;

export function register(data, callback) {
  return dispatch => {
    firebaseAuth().createUserWithEmailAndPassword(data.email, data.password)
      .then((user) => {
        if (user) {
          if (!user.emailVerified) {
            user.sendEmailVerification();
          }
          callback && callback(user);
        }
        firebaseRef.child('/users/' + user.uid).push();
        firebaseRef.child('/users/' + user.uid).set({
          email: user.email,
          emailVerified: user.emailVerified,
          name: data.name,
          phone: data.phone
        });
        firebaseRef.child('/users/' + user.uid).once('value')
          .then((data) => {
            let dUser = data.val();
            console.log(dUser);
            if (!dUser) {
            }
          })
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: 'UPDATE_AUTH',
          err
        });
        callback && callback(undefined, err);
      })
  }
}

export function onAuthStateChanged(firebaseUser) {
  return dispatch => {
    if (firebaseUser) {
      firebaseRef.child('/users/' + firebaseUser.uid).once('value')
        .then((data) => {
          let user = data.val();
          if (!user) {
            firebaseRef.child('/users/' + firebaseUser.uid).push();
          }
          if (!user || user.email !== firebaseUser.email || user.emailVerified !== firebaseUser.emailVerified) {
            firebaseRef.child('/users/' + firebaseUser.uid).set({
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified
            });
          }
          //fetch groups and teams
          firebaseRef.child('/groups/').once('value')
            .then((data) => {
              data.forEach((child) => {
                user[child.key] = true;
              });
              dispatch({
                type: 'UPDATE_AUTH',
                user
              });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      dispatch({
        type: 'UPDATE_AUTH',
        user
      });
    }
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

export function login(email, pw, callback) {
  return dispatch => {
    firebaseAuth().signInWithEmailAndPassword(email, pw)
      .then((user) => {
        console.log(user);
        callback && callback(user);
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: 'UPDATE_AUTH',
          err
        });
        callback && callback(undefined, err);
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

export function fetchUsers() {
  return dispatch => {
    firebaseRef.child('/users/').on('value', (snap) => {
      let users = {};
      snap.forEach((child) => {
        users[child.key] = child.val();
      });
      dispatch({
        type: 'FETCH_USERS',
        users
      });
    });
  }
}