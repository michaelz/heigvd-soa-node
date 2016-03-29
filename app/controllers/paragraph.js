var express = require('express'),
    router = express.Router(),
    bullshit = require('../utils/bullshit'),
    helpers = require('../utils/helpers'),
    casual = require('casual'),
    mongoose = require('mongoose'),
    Paragraph = mongoose.model('Paragraph');

module.exports = function (app) {
  app.use('/api/paragraphs/', router);
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
        Paragraph.find(
                { $text : { $search : q } },
                { score : { $meta: "textScore" } }
            )
            .sort({ score : { $meta : 'textScore' } })
            .exec(function(err, results) {
                // TODO: Regex the result to emphasize the searched words.
                var data = new Array(results.length);
                for (var i = 0; i < results.length; i++) {
                    data[i] = {
                        _id: results[i]._id,
                        shorttext : helpers.textTrimmer(results[i].text,120),
                        text: results[i].text,
                        title: results[i].title,
                        author: results[i].author
                    };
                }
                res.jsend(data);
            });
    } else {
        Paragraph.find(function (err, results) {
            if (err) {
                res.jerror(err);
                return;
            }
            var data = new Array(results.length);
            for (var i = 0; i < results.length; i++) {
                data[i] = {
                    _id: results[i]._id,
                    shorttext : helpers.textTrimmer(results[i].text,120),
                    text: results[i].text,
                    title: results[i].title,
                    author: results[i].author
                };
            }
            res.jsend(data);
        })
    }
});
