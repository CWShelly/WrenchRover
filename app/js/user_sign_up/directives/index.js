module.exports = exports = function(app) {
  require('./user_sign_up_form.js')(app);
  require('./user_sign_in_form.js')(app);
  require('./password.js')(app);
};
