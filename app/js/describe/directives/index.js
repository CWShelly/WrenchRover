module.exports = function(app) {
  require('./describe_issue.js')(app);
  require('./describe_list_item.js')(app);
  require('./common_maintenance.js')(app);
  require('./first_level_children.js')(app);
  require('./second_level_children.js')(app);
  require('./second_sibling.js')(app);
  require('./oil_list.js')(app);
  require('./oil_first_children.js')(app);
  require('./oil_second.js')(app);
  require('./chosen_service.js')(app);
  require('./chosen_oil.js')(app);
  require('./dashlights_list.js')(app);
  require('./chosen_dash.js')(app);
  require('./shopping_cart.js')(app);
};
