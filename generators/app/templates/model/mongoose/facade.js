const Facade = require('../../lib/facade'),
  <%= model.camelName %>Schema = require('./schema');

class <%= model.pascalName %>Facade extends Facade {}

module.exports = new <%= model.pascalName %>Facade('<%= model.pascalName %>', <%= model.camelName %>Schema);
