var crypto = require('crypto'),
    base64url = require('base64url'),
    config = require('../../config/config'); // to access the secret key


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
