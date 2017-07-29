/**
 * Created by jamesbillinger on 4/2/17.
 */
require('babel-core/register')();
let express = require('express');
let winston = require('winston');
let expressWinston = require('express-winston');
let tracer = require('tracer');
let bodyParser = require('body-parser');
let async = require('async');

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('files'));


global.logger = tracer.console();
global.log = tracer.console().log;
global.info = tracer.console().info;
global.trace = tracer.console().trace;
global.debug = tracer.console().debug;
global.warn = tracer.console().warn;
global.error = tracer.console().error;
if (process.env.NODE_ENV !== 'development') {
  var msg = [
    '{{(req.headers && req.headers["x-forwarded-for"]) || (req.connection && req.connection.remoteAddress) || "-"}}',
    '-',
    '{{[new Date()]}}',//custom
    '{{req.user && req.user.email || "-"}}',//custom
    //'{{req._httpAuthInfo && req._httpAuthInfo.name || "-"}}',
    //'[{{req._clfDate || "-"}}]',
    '"{{req.method}} {{req.originalUrl || req.url}} HTTP/{{req.httpVersion}}"',
    //'{{res.statusCode || "-"}}',
    //'{{res._headers && res._headers["content-length"] || "-"}}',
    //'"{{req.headers.referer || req.headers.referrer || "-"}}"',
    //'"{{req.headers["user-agent"] || "-"}}"',
    //'{{res.responseTime || "-"}}ms'
  ].join(' ');

  //log(msg);
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: false,
        colorize: true
      })
    ],
    meta: false,
    msg: msg,
    expressFormat: false,
    colorize: true
  }));
}

let middleware = require('./middleware');
let manifest = require(__dirname + '/files/dist/assets.json');

let admin = require('firebase-admin');
var db = admin.database();

let firebase = require('firebase');
const config = require('./config');
const firebaseApp = firebase.initializeApp(config.firebase);
const firebaseRef = firebaseApp.database().ref();

let serviceAccount = require('./haysbaseballclub.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://haysbaseballclub-33b63.firebaseio.com"
});


app.delete('/api/user/:uid', middleware.api, middleware.requireUser(admin), (req, res) => {
  log('deleting user', req.params.uid);
  admin.auth().deleteUser(req.params.uid)
    .then((userRecord) => {
      res.apiResponse('ok');
    })
    .catch((err) => {
      res.apiError(err);
    });
});

app.post('/api/adduser', middleware.api, middleware.requireUser(admin), (req, res) => {
  //create user
  log('creating user', req.body);
  if (req.body.email) {
    admin.auth().createUser({
      email: req.body.email,
      password: req.body.password || 'ALDSklksdflk09',
      emailVerified: true
    })
      .then((userRecord) => {
        firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password || 'ALDSklksdflk09')
          .then((user) => {
            let newUser = {
              uid: userRecord.uid,
              email: userRecord.email,
              emailVerified: !!userRecord.emailVerified,
              name: req.body.name || '',
              phone: req.body.phone || '',
              willingToCoach: !!req.body.willingToCoach
            }
            if (userRecord.providerData && userRecord.providerData[0]) {
              newUser.provider = userRecord.providerData[0].providerId;
            }
            firebaseRef.child('/users/' + userRecord.uid).set(newUser);
            firebase.auth().sendPasswordResetEmail(req.body.email)
              .then(() => {
                firebase.auth().signOut();
                res.apiResponse({userRecord});
              })
              .catch((err) => {
                console.log(err);
                firebase.auth().signOut();
                res.apiResponse({userRecord});
              })
          })
          .catch((err) => {
            log(err);
            res.apiResponse({userRecord});
          })
      })
      .catch((err) => {
        res.apiResponse({err});
      });
  } else {
    res.apiResponse({err: 'no email provided'});
  }
});

app.get('/api/contact', middleware.api, (req, res) => {
  let coaches = {};
  db.ref('teams').once('value')
    .then((snap) => {
      let team = snap.val();
      Object.keys(team.coaches || {}).map((k) => {
        if (coaches[k]) {
          coaches[k].teams.push({
            uid: team.uid,
            ageGroup: team.ageGroup,
            name: team.name
          });
        } else {
          coaches[k] = [{
            teams: [{
              uid: team.uid,
              ageGroup: team.ageGroup,
              name: team.name
            }]
          }];
        }
      });
      async.eachLimit(Object.keys(coaches), 5, (k, callback) => {
        db.ref('users/' + k).once('value')
          .then((snap2) => {
            let user = snap2.val(0);
            coaches[k].name = user.name;
            coaches[k].email = user.email;
            coaches[k].phone = user.phone;
            callback();
          })
          .catch((err) => {
            log(err);
            callback();
          });
      }, (done) => {
        res.apiResponse(coaches);
      });
    })
    .catch((err) => {
      log(err);
      res.apiResponse({});
    });
});

app.get('/*', (req, res) => {
  res.render('index', {
    NODE_ENV: process.env.NODE_ENV || 'production',
    chunk: manifest && manifest.app && manifest.app.js
  });
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
let router = express.Router();
app.use(router);
let server = app.listen(3000);
console.log('Web Server started on port 3000');