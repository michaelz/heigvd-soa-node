var express = require('express'),
    router = express.Router(),
    base64url = require('base64url'),
    authMiddleware = require('../middlewares/authMiddleware'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function (app) {
      app.use('/api/ui/', router);
};

/*
 * Send tree view
 */
router.get('/bookmarks',authMiddleware.needsLogin, function (req, res, next) {
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


router.get('/tasks',authMiddleware.needsLogin, function (req, res, next) {
    var payload = JSON.parse(base64url.decode(req.payload));
    var user;
    var response = {
        rows:[
            {
                view:"datatable",
        		columns:[
        			{ id:"taskDesc",   header:"Task Description",    width:400 },
        			{ id:"user",    header:"User" , width:160 }
        		],
        		autowidth:true,
        		autoheight:true,
        		data:[
        			{ id:1, taskDesc:"My first task",  user:"michael"},
        			{ id:2, taskDesc:"My second task", user:"john"}
        		]
            },
            {
                // <input id="m" autocomplete="off" /><button>Send</button>
                view:"form",
                id:"send_form",
                autowidth: true,
                elements:[
                    { view:"text", type:"text", label:"Task Description", name: 'taskDesc', css:'taskDesc', id:'taskDesc'},
                    { margin:5, cols:[
                        { view:"button", value:"Send" , type:"form", id: "send", css:"send" }
                    ]}
                ]
            }
        ]


    };
    User.findById(payload.id, function (err, user) {
        if (err) {
            res.jerror("user not found");
        }
        res.send(response);
    });


});
