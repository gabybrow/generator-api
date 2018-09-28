const Controller = require('../../lib/controller'),
  ownerFacade = require('./facade');

class OwnerController extends Controller {}

module.exports = new OwnerController(ownerFacade);
