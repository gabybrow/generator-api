const _ = require('lodash');

const distinct = value => {
  return value ? true : null;
};

const fields = options => {
  let fieldsVar = null;

  if (options) {
    fieldsVar = options.split(',');
  }

  return fieldsVar;
};

const filters = options => {
  let filtersVar = null;

  if (!_.isEmpty(options)) {
    filtersVar = {};
    _.forOwn(options, (value, key) => {
      try {
        filtersVar[key] = JSON.parse(value);
      } catch (err) {
        filtersVar[key] = value.split(',');
      }
    });
  }

  return filtersVar;
};

const limit = value => {
  value = parseInt(value);

  if (!value || value < 0) {
    value = 0;
  }

  return value;
};

const offset = value => {
  value = parseInt(value);

  if (!value || value < 0) {
    value = 0;
  }

  return value;
};

const sort = options => {
  let properties,
    sortVar = null;

  if (options) {
    properties = options.split(',');

    sortVar = _.map(properties, x => {
      if (x.indexOf('-') === 0) {
        return [x.substr(1), 'DESC'];
      } else {
        return [x, 'ASC'];
      }
    });
  }

  return sortVar;
};

const queryable = (query, attributes) => {
  let queryableAttributes = _.filter(attributes, (elem) => elem.queryable);
  if (!query.q) return {};
  const options = {
    $or: []
  };
  if (queryableAttributes.length < 1)
    queryableAttributes = _.filter(attributes, (elem) => elem.type.constructor.key === 'STRING');
  queryableAttributes.forEach(attr => {
    const q = {};
    q[attr.field] = { $iLike: '%' + query.q + '%' };
    options.$or.push(q);
  });
  return options;
};

module.exports = {
  distinct,
  fields,
  filters,
  limit,
  offset,
  sort,
  queryable
};