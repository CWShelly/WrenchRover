module.exports = exports = function(app) {
  require('./mini_dir.js')(app);
  require('./dash_dir.js')(app);
  require('./quotes.js')(app);
  require('./avails.js')(app);
};
