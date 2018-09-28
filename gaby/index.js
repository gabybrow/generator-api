const express = require('express'),
  migrationsManager = require('./migrations'),
  helmet = require('helmet'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  config = require('./config'),
  routes = require('./routes'),
  logger = require('./services/logger'),
  initialize = require('./config/init')();

const init = () => {
  const app = express();
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  if (!config.isTesting) {
    morgan.token('req-params', req => req.params);
    app.use(
      morgan(
        '[:date[clf]] :remote-addr - Request ":method :url" with params: :req-params. Response status: :status.'
      )
    );
  }

  app.use('/api', routes);
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: err });
  });

  module.exports = app;

  Promise.resolve()
    .then(() => {
      if (!config.isTesting) {
        return migrationsManager.check();
      }
    })
    .then(() => {
      app.listen(config.server.port, () => {
        logger.info(`Listening on port: ${config.server.port}`);
      });
    })
    .catch(logger.error);
};

init();
