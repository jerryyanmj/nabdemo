
var mongo = require('mongodb').MongoClient
var format = require('util').format;
var common = require('./common.js');

module.exports = function (app) {
    app.get('/', common.checkSession,
        function (req, res) {
        res.render('index', { title: 'ejs' });
    });

    app.get('/login', function (req, res) {
        res.render('login.html', { title: 'ejs' });
    });

    app.get('/dashboard', common.checkSession,
        function (req, res) {
        res.render('index.html', { title: 'ejs' });
    });

    app.get('/demo', common.checkSession,
        function (req, res) {
        res.render('index2.html', { title: 'ejs' });
    });    

    app.get('/collection/:name', function (req, res) {
        var rand = Math.floor(Math.random() * 10);
        mongo.connect('mongodb://54.68.140.240:27017/default', function (err, db) {
            db.collection(req.param("name"), function (err, collection) {
                collection.find().sort( { start_datetime_ts: -1 } ).skip(28*rand).limit(28).toArray(function (err, items) {
                    db.close();
                    res.send(items);
                });
            });
        });
    });

    app.get('/aggregated/:name', function (req, res) {
        var coeff = 1000 * 60 * 5;
        var date = new Date();
        var rounded = new Date(Math.round(date.getTime() / coeff) * coeff)
        var now = Math.floor(rounded / 1000);
        var ago = now - 3600;
        mongo.connect('mongodb://54.68.140.240:27017/default', function (err, db) {
            db.collection(req.param("name"), function (err, collection) {
                collection.find({
                    start_datetime_ts: {
                        $gte: ago,
                        $lt: now
                    },
                    device_type: 'Browser',
                    stream_type: 'SS',
                    chunk_type: 'Live'
                }).sort( { start_datetime_ts: -1 } ).toArray(function (err, items) {
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

    // Application's user authentication
    app.post('/login', function( req, res ) {

        common.login(
            req.body.email,
            req.body.password,
            function ( loginError, email ) {
                if(email) {
                    req.session.email = email;
                    res.redirect( '/dashboard' );
                } else {
                    res.render( 'login.html', { error: loginError } );
                }
            }
        )
    });


}
