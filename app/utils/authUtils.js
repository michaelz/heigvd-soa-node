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
