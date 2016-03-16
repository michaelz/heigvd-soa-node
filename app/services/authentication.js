var crypto = require('crypto'),
    base64url = require('base64url'),
    config = require('../../config/config'), // to access the secret key
    mongoose = require('mongoose'),
    User = mongoose.model('User');


/*
 * Checks the validity of the token
 * Returns the payload if valid, false if not.
 */
function verifyToken(token) {
    if (token.length != 3) {
        console.log('verifytoken: wrong format');
        return false;
    }
    var header = token[0];
    var payload = token[1];
    var reqSig =  token[2];

    // Testing the expiration date
    if (payload.exp > Date.now()) {
        console.log('verifytoken: expired');
        return false;
    }
    var genSig = base64url(
          crypto.createHmac('sha256', config.secret)
              .update(header + "." + payload)
              .digest('bin')
          );
    if (reqSig != genSig) { // TODO: Check avec CHabloz pour voir comment comparer les hash mieux
        console.log('verifytoken: signature mismatch');
        return false;
    }
    return payload;
}

/**
 * Middleware that redirects a user to a login page if the
 * sent authentication token is invalid (or non are found).
 */
module.exports.needsLogin = function (req, res, next) {
    if ( !req.get('Authorization')) {
        if (!req.query.token) {
            res.jerror('no token');
            return;
        }
        token = req.query.token.split('.');
    } else {
        token = req.get('Authorization').split('.');
    }
    if (!verifyToken(token)) {
        res.jerror('token fail');
        return;
    }
    req.payload = verifyToken(token);

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
