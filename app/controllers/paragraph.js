var express = require('express'),
    router = express.Router(),
    bullshit = require('../utils/bullshit'),
    casual = require('casual'),
    mongoose = require('mongoose'),
    Paragraph = mongoose.model('Paragraph');

module.exports = function (app) {
  app.use('/paragraphs/', router);
};

/**
 * Create 100 new bullshit paragraphs
 */
router.get('/setup', function(req, res){
    var pCollection = [];

    for (var i = 0; i < 100; i++) {
        var name = casual.name_prefix + ' ' + casual.full_name;
        var sentence = bullshit.generateSentences(Math.floor((Math.random() * 40) + 10));
        var paragraph = {
            title: bullshit.generateSentences(1),
            author: name,
            text: sentence
        };
        pCollection.push(paragraph);
    }
    Paragraph.collection.insert(pCollection, function(err, docs) {
        if (err) {
            res.jerror(err);
            return;
        }
        res.jsend('ok');
    });
});



/**
 * Get all Paragraphs
 */
router.get('/data/', function (req, res, next) {
    if (req.query.search) {
        var q = req.query.search;
        Paragraph.find(
                { $text : { $search : q } },
                { score : { $meta: "textScore" } }
            )
            .sort({ score : { $meta : 'textScore' } })
            .exec(function(err, results) {
                res.jsend(results);
            });
    } else {
        Paragraph.find(function (err, results) {
            if (err) {
                res.jerror(err);
                return;
            }
            res.jsend(results);
        })
    }
});

/*
 * Front end view
 */
router.get('/', function (req, res, next) {
    var pid;
    if(req.query.search) {
        console.log(req.query.search);
        pid = 'search?q=' + req.query.search;
    } else {
        pid = 'search';
    }
    res.render('webix', {
      title: 'Search paragraphs',
      pageid: pid
    });
});
