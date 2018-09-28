const Router = require('express').Router,<% if (useAuthentication) { %>
  passport = require('passport'),<% } %>
  router = new Router();
<% if (useAuthentication) { %>require('./auth/passport');
<% } %>
<%_ models.forEach(function(model){ _%>
const <%= model.camelName %> = require('./model/<%= model.slugName %>/router');
<%_ }) _%>

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to <%= serverName %> API!' });
});
<% if (useAuthentication) { %>router.use(passport.authenticate('jwt', { session: false }));
<% } %>
<%_ models.forEach(function(model){ _%>
router.use('/<%= model.slugName %>', <%= model.camelName %>);
<%_ }) _%>

module.exports = router;
