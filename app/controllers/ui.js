var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

module.exports = function (app) {
      app.use('/api/ui/', router);
};

/*
 * Send tree view
 */
router.get('/bookmarks', function (req, res, next) {
    res.send({
        view:"tree",
        select:true,
        data: [
            {id:"root", value:"Cars", open:true, data:[
                { id:"1", open:true, value:"Toyota", data:[
                    { id:"1.1", value:"Avalon" },
                    { id:"1.2", value:"Corolla" },
                    { id:"1.3", value:"Camry" }
                ]},
                { id:"2", value:"Skoda", open:true, data:[
                    { id:"2.1", value:"Octavia" },
                    { id:"2.2", value:"Superb" }
                ]}
            ]}
        ]
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
