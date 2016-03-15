var express = require('express'),
    router = express.Router(),
    config = require('../../config/config'),
    authentication = require('../services/authentication'),
    crypto = require('crypto'),
    base64url = require('base64url'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');
var secret;

require('express-jsend');

module.exports = function (app) {
    app.use('/auth/', router);
    secret = app.settings.secret;
};

router.post('/', authentication.findUser, authentication.checkPassword, function (req, res, next) {

// JWT Generation

  var header = {
      "alg": "HS256",
      "typ": "JWT"
  }
  var payload = {
      "id": req.user.id,
      "username": req.user.username,
      "exp": Date.now() + 20*1000*60
  }
  // TODO: Export token generation to another file (token generate & token verify)
  // Create a key per user, and in the token (payload), an link to an id to that key.

  var signature = crypto.createHmac('sha256', secret)
    .update(base64url(JSON.stringify(header)) + "." +
            base64url(JSON.stringify(payload)))
    .digest('bin');

  var token = base64url(JSON.stringify(header)) + "." +
              base64url(JSON.stringify(payload)) + "." +
              base64url(signature);

  res.jsend(token);
});

/**
 * Returns the user name
 * Needs a auth token, either with an auth query in the url or in the header (Authorization)
 */
router.get('/user', authentication.verifyToken, function(req, res, next) {
    var userPayload = base64url.decode(req.body);
    var data = JSON.parse(userPayload);
    res.jsend(data.username);
});
