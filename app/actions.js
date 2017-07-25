import firebase from 'firebase';
import config from '../config.json';
import pick from 'lodash/pick';

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
          if (!user) {
            user = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified
            }
          }
          //fetch groups and teams
          firebaseRef.child('/groups/').once('value')
            .then((data) => {
              data.forEach((child) => {
                let v = child.val();
                console.log(v, child.key);
                if (v[firebaseUser.uid]) {
                  user[child.key] = true;
                }
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
        user: undefined
      });
    }
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

export function resetPassword(email) {
  return dispatch => {
    firebaseAuth().sendPasswordResetEmail(email)
  }
}

export function setUserGroup(uid, group, value, callback) {
  return dispatch => {
    firebaseRef.child('/groups/' + group + '/' + uid).push();
    firebaseRef.child('/groups/' + group + '/' + uid).set(value);
    dispatch({
      type:'UPDATE_USER',
      uid,
      update: { [group]: value }
    });
  }
}

export function fetchUsers() {
  return dispatch => {
    firebaseRef.child('/users/').on('value', (snap) => {
      let users = {};
      snap.forEach((child) => {
        users[child.key] = child.val();
      });
      //fetch groups for user
      firebaseRef.child('/groups/').once('value')
        .then((data) => {
          data.forEach((child) => {
            let v = child.val();
            Object.keys(v || {}).map((k) => {
              if (users[k]) {
                users[k][child.key] = true;
              }
            });
          });
          dispatch({
            type: 'FETCH_USERS',
            users
          });
        });
    });
  }
}

export function addUser(user, callback) {
  return dispatch => {
    let newRef = firebaseRef.child('/users/').push();
    newRef.set({
      uid: newRef.getKey(),
      ...user
    });
    callback && callback();
  }
}

export function updateUser(user, callback) {
  return dispatch => {
    firebaseRef.child('/users/' + user.uid).set(pick(user, ['uid','name','phone','email','willingToCoach']));
    callback && callback();
  }
}

export function deleteUser(uid) {
  return dispatch => {
    firebaseRef.child('/users/' + uid).remove();
  }
}


export function fetchTeams() {
  return dispatch => {
    firebaseRef.child('/teams/').on('value', (snap) => {
      let teams = {};
      snap.forEach((child) => {
        teams[child.key] = child.val();
      });
      dispatch({
        type: 'FETCH_TEAMS',
        teams
      });
    });
  }
}

export function addTeam(team, callback) {
  return dispatch => {
    let newRef = firebaseRef.child('/teams/').push();
    newRef.set({
      uid: newRef.getKey(),
      ...team
    });
    callback && callback();
  }
}

export function updateTeam(team, callback) {
  return dispatch => {
    firebaseRef.child('/teams/' + team.uid).set(team);
    callback && callback();
  }
}

export function deleteTeam(uid) {
  return dispatch => {
    firebaseRef.child('/teams/' + uid).remove();
  }
}


export function fetchPlayers() {
  return dispatch => {
    firebaseRef.child('/players/').on('value', (snap) => {
      let players = {};
      snap.forEach((child) => {
        players[child.key] = child.val();
      });
      dispatch({
        type: 'FETCH_PLAYERS',
        players
      });
    });
  }
}

export function addPlayer(player, callback) {
  return dispatch => {
    let newRef = firebaseRef.child('/players/').push();
    newRef.set({
      uid: newRef.getKey(),
      ...player
    });
    callback && callback();
  }
}

export function updatePlayer(player, callback) {
  return dispatch => {
    firebaseRef.child('/players/' + player.uid).set(player);
    callback && callback();
  }
}

export function deletePlayer(uid) {
  return dispatch => {
    firebaseRef.child('/players/' + uid).remove();
  }
}