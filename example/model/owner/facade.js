const Facade = require('../../lib/facade'),
  Owner = require('../../model').owner;

class OwnerFacade extends Facade {}

module.exports = new OwnerFacade(Owner);
