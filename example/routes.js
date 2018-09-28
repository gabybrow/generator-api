const Router = require('express').Router,
  passport = require('passport'),
  router = new Router();
require('./auth/passport');

const pet = require('./model/pet/router');
const owner = require('./model/owner/router');
const user = require('./model/user/router');

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to example API!' });
});
router.use(passport.authenticate('jwt', { session: false }));

router.use('/pet', pet);
router.use('/owner', owner);
router.use('/user', user);

module.exports = router;
