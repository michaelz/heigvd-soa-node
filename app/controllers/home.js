var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bullshit = require('../utils/bullshit');

module.exports = function (app) {
  app.use('/', router);
};

/**
 * Renders Home page template with random phrase
 */
router.get('/', function (req, res, next) {
    bullshit.initializeSentencePool();

    var phrase = bullshit.generateSentences(2);
    res.render('index', {
      title: 'Welcome',
      quote: phrase,
      pageid: 'home'
    });
});

/**
 * Render Login box
 */
router.get('/login', function (req, res, next) {
    res.render('webix', {
      title: 'Login',
      pageid: 'login',
      partial: 'login'
    });
});

/**
 * Render Bookmarks
 */
router.get('/bookmarks', function (req, res, next) {
    res.render('webix', {
        title: 'My Bookmarks',
        pageid: 'bookmarks'
    });
});


/**
 * Render tasks
 */

router.get('/tasks', function(req, res){
    res.render('webix', {
      title: 'Websocket Task list',
      pageid: 'tasks',
      partial: 'tasks',
      has_websocket: true
    });
});

/**
 * Render Search page
 */
 router.get('/paragraphs/', function (req, res, next) {
     var pid;
     if(req.query.search) {
         pid = 'search?q=' + req.query.search;
     } else {
         pid = 'search';
     }
     res.render('webix', {
       title: 'Search paragraphs',
       pageid: pid,
       partial: 'paragraphs'
     });
 });
