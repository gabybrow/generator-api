const Router = require('express').Router,
  router = new Router();

const user = require('./model/user/router');
const pet = require('./model/pet/router');

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to gaby API!' });
});

router.use('/user', user);
router.use('/pet', pet);

module.exports = router;
