var express = require('express'),
    router = express.Router(),
    authentication = require('../middlewares/authMiddleware'),
    mongoose = require('mongoose');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Welcome !'
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
