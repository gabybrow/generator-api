const Controller = require('../../lib/controller'),
  petFacade = require('./facade');

class PetController extends Controller { };

module.exports = new PetController(petFacade);
