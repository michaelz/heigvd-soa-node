var crypto = require('crypto'),
    base64url = require('base64url'),
    config = require('../../config/config'), // to access the secret key
    mongoose = require('mongoose'),
    User = mongoose.model('User');


/*
 * Middleware / check token with secret key
 * TODO: Check expiration
  * TODO: Export the decrypt to another file
 */

module.exports.verifyToken = function (req, res, next) {
    var token;
    if ( !req.get('Authorization')) {
        if (!req.query.token) {
            res.jerror('missing auth token');
            return;
        }
        token = req.query.token.split('.');
    } else {
        token = req.get('Authorization').split('.');
    }


    if (token.length != 3) {
        res.jerror('Authorization token fail');
        return;
    }

    var header = token[0];
    var payload = token[1];
    var reqSig =  token[2];

    // Testing the expiration date
    if (payload.exp > Date.now()) {
        res.jerror('Authorization token fail');
    }

    // the below should be in a dedicated function.
    var genSig = base64url(
          crypto.createHmac('sha256', config.secret)
              .update(header + "." + payload)
              .digest('bin')
          );
    if (reqSig != genSig) { // TODO: Check avec CHabloz pour voir comment comparer les hash mieux
        res.jerror('Authorization token fail');
        return;
    }
    req.body = payload;
    next();
}

/**
 * Finds a user
 */
module.exports.findUser = function (req, res, next) {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
            res.jerror(err);
            return;
        } else if (!user) {
            res.jerror('User not found');
            return
        }
        req.user = user;
        next();
    });
};

/**
 * Checks a password with a real user (needs req.user to be valid)
 */
module.exports.checkPassword = function (req, res, next) {
    if (!req.user || !req.user.password) {
        res.jerror('invalid user');
        return;
    }
    var realpassword = req.user.password;
    var sentpassword = req.body.password;
    if (!sentpassword) {
        res.jerror('Missing password');
        return;
    }
    if (realpassword != sentpassword) {
        res.jerror('Problem with login / password');
        return;
    }

    next();
}
