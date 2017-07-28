/**
 * Created by jamesbillinger on 4/2/17.
 */
require('babel-core/register')();
let express = require('express');

let app = express();
app.use(express.static('public'));
app.use(express.static('files'));
let middleware = require('./middleware');

let manifest = require(__dirname + '/files/dist/assets.json');

let admin = require('firebase-admin');
let serviceAccount = require('./haysbaseballclub.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://haysbaseballclub-33b63.firebaseio.com"
});
app.delete('/user/:uid', middleware.api, middleware.requireUser(admin), (req, res) => {
  admin.auth().deleteUser(req.params.uid)
    .then((userRecord) => {
      res.apiResponse();
    })
    .catch((err) => {
      res.apiResponse(err);
    });
});
app.get('/validate', middleware.api, (req, res) => {
  admin.auth().updateUser(uid, {
    emailVerified: true
  })
    .then((userRecord) => {
      res.render('index', {
        NODE_ENV: process.env.NODE_ENV || 'production',
        chunk: manifest && manifest.app && manifest.app.js
      });
    })
    .catch((err) => {
      res.render('index', {
        NODE_ENV: process.env.NODE_ENV || 'production',
        chunk: manifest && manifest.app && manifest.app.js
      });
    });
});
app.post('/register', middleware.api, (req, res) => {
  admin.auth().getUserByEmail(req.body.email)
    .then((userRecord) => {
      let user = userRecord;
      admin.auth().createUser({
        uid: user.uid,
        email: user.email,
        password: user.password
      })
        .then((userRecord) => {
          res.apiResponse(userRecord);
        })
        .catch((err) => {
          res.apiResponse(undefined, err);
        });
    })
    .catch((error) => {
      //create user
      admin.auth().createUser({
        email: user.email,
        password: user.password
      })
        .then((userRecord) => {
          res.apiResponse(userRecord);
        })
        .catch((err) => {
          res.apiResponse(undefined, err);
        });
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