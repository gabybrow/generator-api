class Controller {
  constructor(facade) {
    this.facade = facade;
  }

  find(req, res, next) {
    return this.facade
      .find(req.query)
      .then(collection => res.status(200).json(collection))
      .catch(next);
  }

  findOne(req, res, next) {
    return this.facade
      .findOne(req.query)
      .then(doc => res.status(200).json(doc))
      .catch(next);
  }

  findById(req, res, next) {
    return this.facade
      .findById(req.params.id, req.query)
      .then(doc => {
        if (!doc) {
          return res.status(404).end();
        }
        return res.status(200).json(doc);
      })
      .catch(next);
  }

  create(req, res, next) {
    return this.facade
      .create(req.body)
      .then(doc => {
        res.status(201).json(doc);
      })
      .catch(next);
  }

  update(req, res, next) {
    const conditions = { _id: req.params.id };

    return this.facade
      .update(conditions, req.body)
      .then(doc => {
        if (!doc) {
          return res.status(404).end();
        }
        return res.status(200).json(doc);
      })
      .catch(next);
  }

  remove(req, res, next) {
    return this.facade
      .remove(req.params.id)
      .then(doc => {
        if (!doc) {
          return res.status(404).end();
        }
        return res.status(204).end();
      })
      .catch(next);
  }

  itemById(req, res, next) {
    return this.facade
      .findById(req.params.id, req.query)
      .then(doc => {
        if (!doc) {
          return res.status(404).end();
        }
        req.item = doc;
        next();
      })
      .catch(next);
  }
}

module.exports = Controller;
