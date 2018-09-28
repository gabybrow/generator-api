const bcrypt = require('bcrypt'),
  config = require('../../../config'),
  errors = require('../../../services/errors');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING,
        field: 'first_name',
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'last_name',
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        isEmail: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      authenticationCode: {
        type: DataTypes.STRING,
        field: 'authentication_code',
        allowNull: false
      },
    },
    {
      timestamps: false,
      paranoid: true,
      underscored: true,
      freezeTableName: true
    }
  );

  User.create = userData => {
    return bcrypt.hash(userData.password, saltRounds).then(hash => {
      userData.password = hash;
      const newUser = User.build(userData);
      return bcrypt.genSalt(parseInt(config.common.bcrypt.saltRounds)).then(newCode => {
        newUser.authenticationCode = newCode;
        return newUser.save();
      });
    });
  };

  User.signIn = userData => {
    return User.findOne({ where: { username: userData.username } }).then(foundUser => {
      if (!foundUser) throw errors.invalidUser;
      return bcrypt.compare(userData.password, foundUser.password).then(result => {
        if (!result) throw errors.invalidUser;
        return foundUser;
      });
    })
  }

  return User;
};
