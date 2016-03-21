var crypto = require('crypto'),
    base64url = require('base64url'),
    config = require('../../config/config'), // to access the secret key
    authUtils = require('../utils/authUtils.js'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');


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
    if (!authUtils.verifyToken(token)) {
        res.jerror('token fail');
        return;
    }
    req.payload = authUtils.verifyToken(token);

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
