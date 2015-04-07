var express = require('express');
var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(process.cwd() + '/public'));
var mongo = require('mongodb').MongoClient;
var format = require('util').format;

var redis = require('redis');
var subscribe = require('redis-subscribe-sse');

var bodyParser = require('body-parser');
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

// Initialize WEB server cookie parser component
// app.use( cookieParser( "OIFNDFJDHIFHjf4uyfu4y78y4gfjhbjeuyHGHFGUYgr3ubhfoi;djiofuioedsfj3" ) );

// Initialize WEB server session component
var expressSession = require('express-session')
app.use(

    expressSession(
        {
            cookie:
            { 
                path     : '/', 
                httpOnly : true, 
                maxAge   : 60000 * 60 * 24 // Maximum session timeout - 24 hours 
            }, 
            secret:            'nab',
            saveUninitialized: true,
            resave:            true 
        }
    )

);

mongo.connect('mongodb://54.68.140.240:27017/default', function (err, db) {
//mongo.connect('mongodb://localhost:27017/default', function (err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
    }
    db.close();
});

var sse = subscribe({
    channels: ['test_channel', 'channelB'],
    channelsAsEvents: true
});

app.get('/stream', function(req, res) {
    req.socket.setTimeout(0);
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    sse.pipe(res);
});


var routs = require('./routes')(app);
var server = app.listen(process.env.PORT || 3000, function () {

    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);

});
