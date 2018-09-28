const ENVIRONMENT = process.env.NODE_ENV || 'development';

if (ENVIRONMENT !== 'production') {
  require('dotenv').config();
}

const configFile = `./${ENVIRONMENT}`;

const isObject = variable => {
  return variable instanceof Object;
};

/*
 * Deep copy of source object into tarjet object.
 * It does not overwrite properties.
*/
const assignObject = (target, source) => {
  if (target && isObject(target) && source && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(target, key)) {
        target[key] = source[key];
      } else {
        assignObject(target[key], source[key]);
      }
    });
    return target;
  }
};

const config = {
  server: {
    port: process.env.PORT || 8080
  },
  common: {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME || 'example',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      dialect: 'postgres'
    },
    api: {
      bodySizeLimit: process.env.API_BODY_SIZE_LIMIT,
      parameterLimit: process.env.API_PARAMETER_LIMIT
    },
    bcrypt: {
      saltRounds: process.env.SALT_ROUNDS
    },
    mailer: {
      host: process.env.MAILER_HOST,
      port: process.env.MAILER_PORT,
      secure: true,
      subject: process.env.MAILER_SUBJECT,
      from: {
        email: process.env.MAILER_FROM_EMAIL,
        displayName: process.env.MAILER_FROM_DISPLAYNAME
      },
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    },
    session: {
      header_name: 'authorization',
      secret: process.env.NODE_API_SESSION_SECRET,
      audience: process.env.NODE_API_SESSION_AUDIENCE,
      issuer: process.env.NODE_API_SESSION_ISSUER
    }
  }
};

const customConfig = require(configFile).config;
module.exports = assignObject(customConfig, config);
