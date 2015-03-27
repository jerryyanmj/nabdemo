var mongo = require('mongodb').MongoClient
var format = require('util').format;

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', { title: 'ejs' });
    });

    app.get('/', function (req, res) {
        res.render('index', { title: 'ejs' });
    });

    app.get('/collection/:name', function (req, res) {
        //mongo.connect('mongodb://54.68.140.240:27017/default', function (err, db) {
            mongo.connect('mongodb://localhost:27017/default', function (err, db) {
            db.collection(req.param("name"), function (err, collection) {
                collection.find().sort( { start_datetime_ts: -1 } ).limit(5).toArray(function (err, items) {
                    db.close();
                    res.send(items);
                });
            });
        });
    });

    app.get('/video_average_bitrate', function (req, res) {
        //mongo.connect('mongodb://54.68.140.240:27017/default', function (err, db) {
        mongo.connect('mongodb://localhost:27017/default', function (err, db) {
            db.collection("video_average_bitrate", function (err, collection) {
                collection.find().sort( { start_datetime_ts: -1 } ).limit(5).toArray(function (err, items) {
                    db.close();
                    res.send(items);
                });
            });
        });
    });
};