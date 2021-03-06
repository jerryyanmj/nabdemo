var express = require('express');
var app = express();

var env = process.env.NODE_ENV || 'dev';
var config = require('./env/' + env);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(process.cwd() + '/public'));
var mongo = require('mongodb').MongoClient;
var format = require('util').format;

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

mongo.connect(config.MONGO_URL, function (err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
    }
    db.close();
});

var redisURL = require("redis-url").parse(config.REDIS_URL);
console.log(redisURL);
var sse = subscribe({
    ioredis: {
       host: redisURL.hostname,
       port: redisURL.port,
       password: redisURL.password       
    },
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
