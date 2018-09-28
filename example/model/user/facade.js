const Facade = require('../../lib/facade'),
  User = require('../../model').user;

class UserFacade extends Facade {}

module.exports = new UserFacade(User);
