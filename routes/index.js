module.exports = function (app) {
  /*jslint unparam: true */
  app.get('/', function (req, res) {
    res.render('index', { title: 'ejs' });
  });
};