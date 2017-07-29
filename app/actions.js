import firebase from 'firebase';
import config from '../config.json';
import pick from 'lodash/pick';
import moment from 'moment';

const firebaseApp = firebase.initializeApp(config.firebase);
const firebaseRef = firebaseApp.database().ref();
const firebaseAuth = firebase.auth;
let provider = new firebase.auth.GoogleAuthProvider();

export function register(data, callback) {
  return dispatch => {
    firebaseAuth().createUserWithEmailAndPassword(data.email, data.password)
      .then((user) => {
        if (user) {
          if (!user.emailVerified) {
            user.sendEmailVerification();
          }
          firebaseRef.child('/users/' + user.uid).set({
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            name: data.name,
            phone: data.phone
          });
        }
        callback && callback(user);
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: 'UPDATE_AUTH',
          err,
          email: data.email
        });
        callback && callback(undefined, err);
      })
  }
}

export function resendEmailVerification(user, callback) {
  return dispatch => {
    user.sendEmailVerification()
      .then(() => {
        callback && callback();
      })
      .catch((err) => {
        console.log(err);
        callback && callback(err);
      });
  }
}

export function onAuthStateChanged(firebaseUser) {
  return dispatch => {
    if (firebaseUser) {
      firebaseAuth().currentUser.getIdToken()
        .then((token) => {
          global.token = token;
        }).catch((err) => {
          console.log(err);
        });
      firebaseRef.child('/users/' + firebaseUser.uid).once('value').then((data) => {
        let user = data.val();
        if (!user) {
          let newSet = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified
          };
          if (firebaseUser.providerData && firebaseUser.providerData[0]) {
            newSet.provider = firebaseUser.providerData[0].providerId;
            if (firebaseUser.providerData[0].displayName) {
              newSet.name = firebaseUser.providerData[0].displayName;
            }
          }
          firebaseRef.child('/users/' + firebaseUser.uid).set(newSet);
        } else if (user.email !== firebaseUser.email || (!user.emailVerified && firebaseUser.emailVerified)) {
          firebaseRef.child('/users/' + firebaseUser.uid).update({
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified
          });
        } else if ((user.provider && user.provider.providerID) !==
          (firebaseUser.providerData && firebaseUser.providerData[0] && firebaseUser.providerData[0].providerId)) {
          firebaseRef.child('/users/' + firebaseUser.uid).update({
            provider: firebaseUser.providerData && firebaseUser.providerData[0] && firebaseUser.providerData[0].providerId
          });
        }
        firebaseRef.child('/groups/').on('value', (snap) => {
          let groups = {};
          snap.forEach((child) => {
            groups[child.key] = child.val();
          });
          dispatch({
            type: 'UPDATE_AUTH',
            user: user || {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified
            },
            groups
          });
        });
        firebaseRef.child('/users/' + firebaseUser.uid).on('value', (data) => {
          let user = data.val();
          if (user) {
            dispatch({
              type: 'UPDATE_AUTH',
              user
            });
          }
        });
      });
      loadAgeGroups(dispatch);
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

export function loginWithGoogle(email, callback) {
  return dispatch => {
    if (email) {
      provider.setCustomParameters({
        'login_hint': email
      });
    }
    firebaseAuth().signInWithRedirect(provider);
    firebaseAuth().getRedirectResult().then((result) => {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        //var token = result.credential.accessToken;
      }
      let user = result.user;
      callback && callback(user);
    }).catch((err) => {
      // Handle Errors here.
      var errorCode = err.code;
      var errorMessage = err.message;
      // The email of the user's account used.
      var email = err.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = err.credential;
      console.log(err);
      dispatch({
        type: 'UPDATE_AUTH',
        err
      });
      callback && callback(undefined, err);
    });
  }
}

export function applyActionCode(uid, mode, oobCode, newPassword, callback) {
  return dispatch => {
    firebaseAuth().checkActionCode(oobCode)
      .then((code) => {
        if (mode === 'verifyEmail') {
          if (firebaseAuth().currentUser.emailVerified) {
            firebaseRef.child('/users/' + uid).update({
              emailVerified: true
            });
            callback && callback();
          } else {
            firebaseAuth().applyActionCode(oobCode)
              .then(() => {
                firebaseRef.child('/users/' + uid).update({
                  emailVerified: true
                });
                callback && callback();
              })
              .catch((err) => {
                console.log(err);
                callback && callback(err);
              })
          }
        } else if (mode === 'resetPassword') {
          firebaseAuth().confirmPasswordReset(oobCode, newPassword)
            .then(() => {
              callback && callback();
            })
            .catch((err) => {
              console.log(err);
              callback && callback(err);
            })
        } else {
          firebaseAuth().applyActionCode(oobCode)
            .then(() => {
              callback && callback();
            })
            .catch((err) => {
              console.log(err);
              callback && callback(err);
            })
        }
      })
      .catch((cerr) => {
        console.log('cerr:', cerr);
        callback && callback(cerr);
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

export function resetPassword(email, callback) {
  return dispatch => {
    firebaseAuth().sendPasswordResetEmail(email)
      .then(() => {
        callback && callback();
      })
      .catch((err) => {
        console.log(err);
        callback && callback(undefined, err);
      })
  }
}

export function setUserGroup(uid, group, value, groups, callback) {
  return dispatch => {
    if (groups && groups[group] && groups[group][uid]) {
      firebaseRef.child('/groups/' + group + '/' + uid).set(value);
    } else {
      firebaseRef.child('/groups/' + group + '/' + uid).push(value);
    }
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

export function addUser(user, callback) {
  return dispatch => {
    fetch('/api/adduser', {
      headers: {
        'x-access-token': global.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(user)
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (json.userRecord) {
          callback && callback(json.userRecord.uid);
        } else {
          console.log(json);
          callback && callback(undefined, {error: 'No user returned'});
        }
      })
      .catch(ex => {
        console.log(ex);
        callback && callback(undefined, ex);
      });
  }
}

export function updateUser(user, callback) {
  return dispatch => {
    firebaseRef.child('/users/' + user.uid).update(user);
    callback && callback();
  }
}

export function updateUserPassword(password, callback) {
  return dispatch => {
    let user = firebaseAuth().currentUser;
    user.updatePassword(password)
      .then(() => {
        callback && callback();
      })
      .catch((err) => {
        callback && callback(err);
      })
  }
}

export function deleteUser(uid) {
  return dispatch => {
    firebaseRef.child('/users/' + uid).remove();
    firebaseRef.child('/teams').once('value').then((snap) => {
      snap.forEach((child) => {
        let team = child.val();
        if (team && team.coaches && team.coaches[uid]) {
          let coaches = Object.assign({}, team.coaches);
          delete coaches[uid];
          child.update({
            coaches
          });
        }
      });
    });
    firebaseRef.child('/players').once('value').then((snap) => {
      snap.forEach((child) => {
        let player = child.val();
        if (player && player.user && player.users[uid]) {
          let users = Object.assign({}, player.users);
          delete users[uid];
          child.update({
            users
          });
        }
      });
    });
    firebaseRef.child('/groups').once('value').then((snap) => {
      snap.forEach((child) => {
        let group = child.val();
        if (group && group[uid]) {
          delete group[uid];
          child.set(group);
        }
      });
    });
    fetch('/api/user/' + uid, {
      headers: {
        'x-access-token': global.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(err => {
        console.log('deleted user', err);
      })
      .catch(ex => {
        console.log(ex);
      });
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
    let newKey = firebaseRef.child('/players/').push().key;
    firebaseRef.child('/players/' + newKey).set({
      uid: newKey,
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
    firebaseRef.child('/teams').once('value').then((snap) => {
      snap.forEach((child) => {
        let team = child.val();
        if (team && team.players && team.players[uid]) {
          let players = Object.assign({}, team.player);
          delete players[uid];
          child.update({
            players
          });
        }
      });
    });
  }
}


export function fetchFAQs() {
  return dispatch => {
    firebaseRef.child('/faqs/').on('value', (snap) => {
      let faqs = {};
      snap.forEach((child) => {
        faqs[child.key] = child.val();
      });
      dispatch({
        type: 'FETCH_FAQS',
        faqs
      });
    });
  }
}

export function addFAQ(faq, callback) {
  return dispatch => {
    let newKey = firebaseRef.child('/faqs/').push().key;
    firebaseRef.child('/faqs/' + newKey).set({
      uid: newKey,
      ...faq
    });
    callback && callback();
  }
}

export function updateFAQ(faq, callback) {
  return dispatch => {
    firebaseRef.child('/faqs/' + faq.uid).set(faq);
    callback && callback();
  }
}

export function deleteFAQ(uid) {
  return dispatch => {
    firebaseRef.child('/faqs/' + uid).remove();
    firebaseRef.child('/teams').once('value').then((snap) => {
      snap.forEach((child) => {
        let team = child.val();
        if (team && team.faqs && team.faqs[uid]) {
          let faqs = Object.assign({}, team.faq);
          delete faqs[uid];
          child.update({
            faqs
          });
        }
      });
    });
  }
}

export function fetchContacts() {
  return dispatch => {
    fetch('/api/contacts', {
      headers: { 'x-access-token': global.token }
    })
      .then(response => response.json())
      .then(json => {
        dispatch({
          type: 'FETCH_CONTACTS',
          contacts: json
        })
      })
      .catch(ex => {
        console.log(ex);
        dispatch({
          type: 'FETCH_CONTACTS',
          err: ex
        })
      });
  }
}

function loadAgeGroups(dispatch) {
  let t = moment();
  let min;
  let max;
  if (t.month() > 6 || (t.month() === 6 && t.date() > 4)) {
    //next year, not this year
    min = moment().year(t.year() - 10).month(4).date(1).startOf('day');
    max = moment().year(t.year() - 6).month(3).date(30).endOf('day');
  } else {
    //this year
    min = moment().year(t.year() - 11).month(4).date(1).startOf('day');
    max = moment().year(t.year() - 7).month(3).date(30).endOf('day');
  }
  let ageGroups = [{
    value: '10u',
    label: '10U',
    min: min.clone(),
    max: min.clone().add(1, 'year').subtract(1,'day').endOf('day')
  }, {
    value: '9u',
    label: '9U',
    min: min.clone().add(1, 'year'),
    max: min.clone().add(2, 'year').subtract(1,'day').endOf('day')
  }, {
    value: '8u',
    label: '8U',
    min: min.clone().add(2, 'year'),
    max: min.clone().add(3, 'year').subtract(1,'day').endOf('day')
  }, {
    value: '7u',
    label: '7U',
    min: min.clone().add(3, 'year'),
    max: min.clone().add(4, 'year').subtract(1,'day').endOf('day')
  }];
  dispatch({
    type: 'LOAD_AGEGROUPS',
    min,
    max,
    ageGroups
  });
}