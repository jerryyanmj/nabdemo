var mongo = require('mongodb').MongoClient
var format = require('util').format;

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', { title: 'ejs' });
    });

    app.get('/video_average_bitrate', function (req, res) {
        mongo.connect('mongodb://127.0.0.1:27017/default', function (err, db) {
            db.collection("video_average_bitrate", function (err, collection) {
                collection.find().toArray(function (err, items) {
                    res.send(items);
                });
            });
        });
    });
};