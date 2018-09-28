const Facade = require('../../lib/facade'),
  userSchema = require('./schema');

class UserFacade extends Facade { };

module.exports = new UserFacade('User', userSchema);
