/**
 * Created by jamesbillinger on 4/2/17.
 */
require('babel-core/register')();
let express = require('express');
let winston = require('winston');
let expressWinston = require('express-winston');
let tracer = require('tracer');

let app = express();
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

let firebase = require('firebase');
const config = require('./config')
const firebaseApp = firebase.initializeApp(config.firebase);

let serviceAccount = require('./haysbaseballclub.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://haysbaseballclub-33b63.firebaseio.com"
});
app.delete('/user/:uid', middleware.api, middleware.requireUser(admin), (req, res) => {
  log('deleting user', req.params.uid);
  admin.auth().deleteUser(req.params.uid)
    .then((userRecord) => {
      res.apiResponse('ok');
    })
    .catch((err) => {
      res.apiError(err);
    });
});
app.post('/adduser', middleware.api, (req, res) => {
  //create user
  admin.auth().createUser({
    email: req.body.email,
    password: req.body.password || 'ALDSklksdflk09',
    emailVerified: true
  })
    .then((userRecord) => {
      firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password || 'ALDSklksdflk09')
        .then((user) => {
          firebaseRef.child('/users/' + userRecord.uid).set({
            uid: userRecord.uid,
            email: userRecord.email,
            emailVerified: userRecord.emailVerified,
            provider: userRecord.providerData && userRecord.providerData[0],
            name: req.body.name,
            phone: req.body.phone,
            willingToCoach: req.body.willingToCoach
          });
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