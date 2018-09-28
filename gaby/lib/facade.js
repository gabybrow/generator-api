const qs = require('./parsers'),
  _ = require('lodash');

class Facade {
  constructor(Schema) {
    this.Schema = Schema;
  }

  getRequiredInclusions(includes) {
    const res = { model: this.Schema };
    if (includes) res.include = includes;
    return res;
  }

  create(input) {
    return this.Schema.create(input);
  }

  upsert(input) {
    return this.Schema.upsert(input);
  }

  update(conditions, update) {
    return this.Schema.update(conditions, update, { new: true });
  }

  find(query) {
    let options = {},
      related = {};
    const keys = {};

    keys.model = _.keys(this.Schema.rawAttributes);
    keys.query = _.keys(query);
    keys.filters = _.intersection(keys.model, keys.query);

    related = _.pickBy(
      this.Schema.associations,
      association => _.intersection(keys.query, [association.foreignIdentifierField]).length > 0
    );
    keys.related = _.keys(related);

    options.attributes = qs.fields(query.fields);
    // if (options.attributes == null)
    //  options.attributes = query.attributes || null;
    // else if (query.attributes !== undefined)
    //  options.attributes.splice(options.attributes.length, 0, query.attributes);
    options.limit = qs.limit(query.limit) || 50;
    options.offset = qs.offset(query.offset);
    options.order = qs.sort(query.sort);
    options.include = query.include;
    options.raw = query.raw || false;
    options.where = qs.filters(_.pick(query, keys.filters));
    options.where = Object.assign({}, options.where, query.where);
    options = _.omitBy(options, _.isNull);

    return this.Schema.findAll(options);
  }

  findWithCount(query) {
    let options = {};
    const keys = {};

    keys.model = _.keys(this.Schema.rawAttributes);
    keys.query = _.keys(query);
    keys.filters = _.intersection(keys.model, keys.query);

    options.attributes = qs.fields(query.fields);
    options.limit = qs.limit(query.limit) || 50;
    options.offset = qs.offset(query.offset);
    options.order = qs.sort(query.sort);
    options.include = query.include;
    options.raw = query.raw || false;
    options.where = qs.filters(_.pick(query, keys.filters));
    options.where = Object.assign({}, options.where, query.where);
    options = _.omitBy(options, _.isNull);

    return this.Schema.findAndCountAll(options);
  }

  findOne(query) {
    let options = {};
    const keys = {};

    keys.model = _.keys(this.Schema.rawAttributes);
    keys.query = _.keys(query);
    keys.filters = _.intersection(keys.model, keys.query);

    options.attributes = qs.fields(query.fields);
    options.limit = qs.limit(query.limit) || 50;
    options.offset = qs.offset(query.offset);
    options.order = qs.sort(query.sort);
    options.include = query.include;
    options.raw = query.raw || false;
    options.where = qs.filters(_.pick(query, keys.filters));
    options.where = Object.assign({}, options.where, query.where);
    options = _.omitBy(options, _.isNull);

    return this.Schema.findOne(options);
  }

  findById(id, query) {
    let options = {};
    const keys = {};

    keys.model = _.keys(this.Schema.rawAttributes);
    keys.query = _.keys(query);
    keys.filters = _.intersection(keys.model, keys.query);

    options.attributes = qs.fields(query.fields);
    options.limit = qs.limit(query.limit) || 50;
    options.offset = qs.offset(query.offset);
    options.order = qs.sort(query.sort);
    options.include = query.include;
    options.where = qs.filters(_.pick(query, keys.filters));
    options.where = Object.assign({}, options.where, query.where);
    options = _.omitBy(options, _.isNull);
    return this.Schema.findById(id, options);
  }

  remove(id) {
    return this.Schema.destroy({ where: { id } });
  }
}

module.exports = Facade;
