var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bullshit = require('../utils/bullshit');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
    bullshit.initializeSentencePool();

    var phrase = bullshit.generateSentences(1);
    res.render('index', {
      title: phrase,
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
      has_partial: true // partial will be login.handlebars in partials folder
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
