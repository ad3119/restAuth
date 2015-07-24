module.exports = function(server) {
  var User = require('../models/user.js');

  /* Link local user with facebook or google account*/
  server.put('/account/link', function(req, res, next) {

  });

  /* Unlink facebook or google account */
  server.put('/account/unlink', function(req, res, next) {

  });

  /* Delete user account */
  server.delete('/account/:userId', function(req, res, next) {

  });

};