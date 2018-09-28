const nodemailer = require('nodemailer'),
  config = require('../config'),
  nunjucks = require('nunjucks'),
  fs = require('fs'),
  path = require('path');

const templatesPath = '../templates/';

const renderingConfiguration = {
  autoescape: true,
  express: null,
  watch: false
};

const templateExists = template => {
  return fs.existsSync(path.resolve(__dirname, templatesPath, template));
};

const render = (template, data) => {
  return new Promise((resolve, reject) => {
    // UNDEFINED GUARD
    if (!template) reject(new Error('Template cannot be falsy'));
    if (!data) reject(new Error('data cannot be falsy'));
    // CUSTOM CONFIGURATION
    const env = nunjucks.configure(path.resolve(__dirname, templatesPath), renderingConfiguration);
    if (templateExists(template)) {
      env.render(template, data, (err, output) => {
        if (err) {
          reject(err);
        } else {
          resolve(output);
        }
      });
    } else {
      reject(new Error(`Template (${template}) does not exist.`));
    }
  });
};

const send = (email, content) => {
  return new Promise((resolve, reject) => {
    email = config.common.mailer.user; // TODO: TEMP
    const transporter = nodemailer.createTransport({
      host: config.common.mailer.host,
      port: config.common.mailer.port,
      secure: config.common.mailer.secure,
      auth: config.common.mailer.auth,
      tls: config.common.mailer.tls
    });
    const newEmail = {
      from: `"${config.common.mailer.from.displayName}" <${config.common.mailer.from.email}>`, // sender address
      to: [email], // list of receivers
      subject: `${config.common.mailer.subject}`, // Subject line
      html: content // html body
    };

    transporter.sendMail(newEmail, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

exports.sendEmail = (template, data, email) => {
  return new Promise((resolve, reject) => {
    render(template, data)
      .then(content => {
        return send(email, content);
      })
      .then(resolve)
      .catch(reject);
  });
};
