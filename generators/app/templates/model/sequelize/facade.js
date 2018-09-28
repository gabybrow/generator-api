const Facade = require('../../lib/facade'),
  <%= model.pascalName %> = require('../../model').<%= model.camelName %>;

class <%= model.pascalName %>Facade extends Facade {}

module.exports = new <%= model.pascalName %>Facade(<%= model.pascalName %>);
