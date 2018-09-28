const express = require('express'),
  mongoose = require('mongoose'),
  helmet = require('helmet'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  bluebird = require('bluebird'),
  config = require('./config'),
  routes = require('./routes');

const app = express();

mongoose.Promise = bluebird;
mongoose.connect(config.mongo.url);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use('/', routes);

app.listen(config.server.port, () => {
  console.log(`Magic happens on port ${config.server.port}`)
});

module.exports = app;
