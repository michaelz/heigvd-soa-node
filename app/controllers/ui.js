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
    var delicon = "<span style='color:red; cursor:pointer' class='delbtn webix_icon fa-remove'></span>";
    var addicon = "<span style='color:green;' class='addicon webix_icon fa-plus-circle'></span>";
    // TODO: Would be cool to have a status "TODO, WIP, DONE"
    var response = {
        rows:[
            {
                view:"datatable",
                id:"dtable",
        		columns:[
                    { id:"user",    header:"User" , sort:'string', ajust:true },
                    { id:"taskDesc",   header:"Task Description", fillspace:true ,sort:'string' },
                    { id:"delete", header:"",width:50, template:delicon}
        		],
        		autoheight:true,
        		url: '/tasks/all',
                borderless:true
            },
            {
                view:"form",
                id:"send_form",
                autowidth: true,
                elements:[{
                        margin:2,
                        cols:[
                            { view:"text", type:"text", label:addicon, placeholder:"Enter new task description...", name: 'taskDesc', css:'taskDesc', id:'taskDesc'},
                            { view:"button", value:"Send" , type:"form", id: "send", css:"send", width: 60 }
                        ]
                    }
                ],
                borderless:true
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


router.get('/search', function(req, res, next) {
    var response = {
        view:"list",
        sizeToContent:true,
        autowidth:true,
        height:800,
        type:{
            height:"auto"
        },
        pager: {
            size:15,
            group: 10,
            container: 'main-container'
        },
        tooltip:{
            template:"by <em>#author#</em>"
        },
        template: "<h3 style='font-size:1.2em;line-height:1.4; margin:0'>#title#</h3><p style='font-size: 0.9em;line-height:1.3em'>#text#</p>",
        //fillspace:true,
        id:"search",
        url: '/paragraphs/data'
    };
    if (req.query.q) {
        console.log('searched');
        response.url = '/paragraphs/data?search=' + req.query.q;
        response.title = 'Searching for <em>' + req.query.search + '</em>';
    };
    res.send(response);
});

/*
view:"list",
sizeToContent:true,
pager: {
    size:15,
    group: 10,
    container: 'main-container'
},
tooltip:{
    template:"by <em>#author#</em>"
},
autowidth:true,
fixedRowHeight:false,  rowLineHeight:25, rowHeight:25,
template: "first row <br /> second",
autoheight:true,
fillspace:true,
id:"search",
url: '/paragraphs/data'
*/
