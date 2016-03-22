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
router.get('/', function (req, res, next) {
    if (req.query.search) {
        var q = req.query.search;
        res.jsend(q);
        // TODO: Indexing files
    } else {
        Paragraph.find(function (err, paras) {
            if (err) {
                res.jerror(err);
                return;
            }
            res.jsend(paras);
        })
    }
});
