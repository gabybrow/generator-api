exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    <% if(databaseEngine === 'sequelize') { %>database: {
      name: process.env.NODE_API_DB_NAME_TEST
    },
    <% } %>session: {
      secret: 'some-super-secret'
    }
  }
};
