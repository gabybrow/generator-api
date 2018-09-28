const Facade = require('../../lib/facade'),
  Pet = require('../../model').pet;

class PetFacade extends Facade {}

module.exports = new PetFacade(Pet);
