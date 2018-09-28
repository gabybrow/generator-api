const passport = require('passport'),
  passportJWT = require('passport-jwt'),
  ExtractJWT = passportJWT.ExtractJwt,
  LocalStrategy = require('passport-local').Strategy,
  JWTStrategy = passportJWT.Strategy,
  config = require('../config'),
  User = require('../model').user,
  errors = require('../services/errors');

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.common.session.secret
};

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    (username, password, cb) => {
      return User.signIn({
        username,
        password
      })
        .then(user => {
          return cb(null, user, {
            message: 'Logged In Successfully'
          });
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);

passport.use(
  new JWTStrategy(opts, (jwtPayload, next) => {
    return User.findOne({
      where: { id: jwtPayload.id }
    })
      .then(user => {
        if (!user) return next(new Error('User not found'));
        /*
        // check if the payload authenticationCode is the same as the one in db and check expiration
        if (jwtPayload.authenticationCode !== user.authenticationCode)
          return next(errors.session_expired); 
        */
        return next(null, user);
      })
      .catch(next);
  })
);
