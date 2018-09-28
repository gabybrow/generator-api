const jwt = require('jsonwebtoken'),
  passport = require('passport'),
  Router = require('express').Router,
  router = new Router(),
  bcrypt = require('bcrypt'),
  models = require('../model'),
  config = require('../config');

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : err.message,
        user
      });
    }
    req.login(user, { session: false }, error => {
      if (error) {
        res.send(error);
      }
      // generate a signed json web token with the contents of user object and return it in the response
      const token = jwt.sign(
        {
          id: user.id,
          authenticationCode: user.authenticationCode
        },
        config.common.session.secret
      );
      return res.json({
        user: {
          id: user.id
        },
        token
      });
    });
  })(req, res, next);
});


// THIS ENDPOINT INVALIDATES ALL THE TOKENS OF THE USER
router.post('/invalidateAll', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const user = req.user;
  return bcrypt.genSalt(parseInt(config.common.bcrypt.saltRounds))
    .then(newAuthenticationCode => {
      user.authenticationCode = newAuthenticationCode;
      return user.save()
        .then(savedUser => {
          res.status(200);
          res.end();
        });
    })
    .catch(next);
});


module.exports = router;
