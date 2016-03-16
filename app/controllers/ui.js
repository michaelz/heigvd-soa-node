var express = require('express'),
    router = express.Router(),
    base64url = require('base64url'),
    authentication = require('../services/authentication'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function (app) {
      app.use('/api/ui/', router);
};

/*
 * Send tree view
 */
router.get('/bookmarks',authentication.needsLogin, function (req, res, next) {
    var payload = JSON.parse(base64url.decode(req.payload));
    var user;
    User.findById(payload.id, function (err, user) {
        if (err) {
            res.jerror("user not found");
        }
        res.send({
            view:"tree",
            select:true,
            data: user.bookmarks
        });
    });
});

/**
 * Send login webix view
 */
router.get('/login', function(req,res,next) {
    var response = {
        view:"form",
        id:"log_form",
        width:300,
        elements:[
            { view:"text", label:"Username", name: 'username', id:'username'},
            { view:"text", type:"password", label:"Password", name: 'password', id:'password'},
            { margin:5, cols:[
                { view:"button", value:"Login" , type:"form", id: "login", css:"login" }
            ]}
        ]
    };
    res.send(response);
});
