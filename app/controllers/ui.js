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
 * UI Builder for bookmark tree view
 */
router.get('/bookmarks', authMiddleware.needsLogin, function (req, res, next) {
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
 * UI Builder for login box
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

/**
 * UI Builder for tasks
 */
router.get('/tasks',authMiddleware.needsLogin, function (req, res, next) {
    var payload = JSON.parse(base64url.decode(req.payload));
    var user;
    var delicon = "<span style='color:red; cursor:pointer' class='delbtn webix_icon fa-remove'></span>";
    var addicon = "<span style='color:green;' class='addicon webix_icon fa-plus-circle'></span>";
    // Would be cool to have a status "TODO, WIP, DONE"
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
        		url: '/api/tasks',
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

/**
 * UI Builder for search
 */
router.get('/search', function(req, res, next) {
    var response = {
        rows: [
            {
                view: "form",
                id:"search_form",
                elements: [
                    {
                        view: "text",
                        placeholder:"Enter search term(s)...",
                        css:"searchInput",
                        id:"searchInput"
                    },
                    {
                        view: "button",
                        id:"searchButton",
                        label: "search",
                        css: "searchButton"
                    }
                ]

            },
            {
                view:"list",
                id:"searchlist",
                sizeToContent:true,
                autowidth:true,
                height:800,
                type:{
                    height:"auto"
                },
                pager: {
                    template:"{common.prev()} {common.pages()} {common.next()}",
                    size:15,
                    group: 10,
                    container: 'main-container'
                },
                tooltip:{
                    template:"by <em>#author#</em><br>Full text: #text#"
                },
                template: "<h4 style='font-size:1.1em;line-height:1.2; margin:1em 0 0 0'>#title#</h4><p style='font-size: 0.9em;line-height:1.3em'>#shorttext#</p>",
                //fillspace:true,
                id:"search",
                url: '/api/paragraphs'
            }
        ]
    };

    if (req.query.q) {
        response.rows[1].url = '/api/paragraphs?search=' + req.query.q;
        response.rows[1].tooltip.template = '"by <em>#author#</em>, Score : #score#"<br /> #text#'
    };

    res.send(response);
});
