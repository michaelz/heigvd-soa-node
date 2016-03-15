var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('User');



module.exports = function (app) {
    app.use('/user/', router);
};

mongoose = require('mongoose');


/**
 * Add new user
 */
router.post('/', function (req, res, next) {
    var user = new User(req.body);
    user.save(function (err, createdUser) { // on crée la userne
        if (err) {
            res.jerror(err); // pas très propre, peut donner des informations aux clients
            return; // ne pas oublier. Arrête l'execution de la fonction. Sinon express continue et crash.
        }
        res.status(201).send(createdUser);
    });
});

/**
 * Get all Users
 */
router.get('/', function (req, res, next) {
    User.find(function (err, users) {
        if (err) {
            res.jerror(err);
            return;
        }
        res.send(users);
    })
});
