const express = require('express'),
  <% if (databaseEngine === 'mongoose') { %>mongoose = require('mongoose'),
  bluebird = require('bluebird'),
  <% } else { %>migrationsManager = require('./migrations'),
  <% } %>helmet = require('helmet'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  config = require('./config'),
  routes = require('./routes'),
  logger = require('./services/logger'),
  initialize = require('./config/init')(),
  errors = require('./model/errors'),<% if (useAuthentication) { %>
  auth = require('./auth'),<% } %>
  // path = require('path'),
  cors = require('cors');

const init = () => {
  const app = express();<% if (databaseEngine === 'mongoose') { %>
  mongoose.Promise = bluebird;
  mongoose.connect(config.common.mongo.url);<% } %>
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

  app.use(cors());
  // app.use('/static', express.static(path.join(__dirname, 'static')))
  app.use('/api', routes);<% if (useAuthentication) { %>
  app.use('/auth', auth);<% } %>
  app.use(errors.handle);

  module.exports = app;

  Promise.resolve()
    <% if (databaseEngine === 'sequelize') { %>.then(() => {
      if (!config.isTesting) {
        return migrationsManager.check();
      }
    })
    <% } %>.then(() => {
      app.listen(config.server.port, () => {
        logger.info(`Listening on port: ${config.server.port}`);
      });
    })
    .catch(logger.error);
};

init();
