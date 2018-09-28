module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'pet',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false,
      paranoid: true,
      underscored: true,
      freezeTableName: true
    }
  );
};
