var express = require('express');
var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(process.cwd() + '/public'));

var routs = require('./routes')(app);
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);

  var mongo = require('mongodb').MongoClient
  var format = require('util').format;

  mongo.connect('mongodb://127.0.0.1:27017/local', function (err, db) {
    if (err) {
      throw err;
    } else {
      console.log("successfully connected to the database");
    }
    db.close();
  });
});

