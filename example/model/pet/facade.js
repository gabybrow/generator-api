const Facade = require('../../lib/facade'),
  petSchema = require('./schema');

class PetFacade extends Facade { };

module.exports = new PetFacade('Pet', petSchema);
