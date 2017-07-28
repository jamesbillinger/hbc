exports.api = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Auth-Token,X-Requested-With,Content-Type');

  res.apiResponse = function (data) {
    if (req.query.callback) {
      res.jsonp(data);
    } else {
      res.json(data);
    }
  };

  res.apiError = function (key, err, msg, code) {
    msg = msg || 'Error';
    key = key || 'unknown error';
    msg += ' (' + key + ')';
    console.log(msg + (err ? ':' : ''));
    if (err) {
      console.log(err);
    }
    res.status(code || 500);
    res.apiResponse({ error: key || 'error', detail: err });
  };

  res.apiNotFound = function (err, msg) {
    res.apiError('data not found', err, msg || 'not found', 404);
  };

  res.apiNotAllowed = function (err, msg) {
    res.apiError('access not allowed', err, msg || 'not allowed', 403);
  };

  let keepAlive;
  res.sseSetup = function() {
    req.socket.setKeepAlive(true);
    req.socket.setTimeout(0);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    keepAlive = setInterval(() => {
      res.write(':keep-alive\n\n');
    }, 20000);

    // cleanup on close
    res.on('close', function close() {
      console.log('clearing interval');
      clearInterval(keepAlive);
    });
  };

  res.sseClose = function() {
    res.write("data: " + JSON.stringify('close') + "\n\n");
    res.end();
    clearInterval(keepAlive);
  };

  res.sseSend = function(data) {
    res.write("data: " + JSON.stringify(data) + "\n\n");
  };

  next();
};


exports.requireUser = function(admin, group) {
  return function(req, res, next) {
    let token = req.headers['x-access-token'] || (req.body && req.body.token) || (req.query && req.query.token) || req.params.token;
    if (token) {
      admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
          let uid = decodedToken.uid;
          req.user = {uid: decodedToken.uid};
          next();
        })
        .catch((err) => {
          console.log(err);
          return res.json({
            success: false,
            message: 'Authentication failed'
          });
        });
    } else {
      res.status(403).send({
        error: 'No token provided.'
      });
    }
  };
};
