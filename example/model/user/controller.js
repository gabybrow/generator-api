const Controller = require('../../lib/controller'),
  userFacade = require('./facade');

class UserController extends Controller { };

module.exports = new UserController(userFacade);
