module.exports = (sequelize, DataTypes) => {
  const <%= model.pascalName %> = sequelize.define(
    '<%= model.camelName %>',
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

  return <%= model.pascalName %>;
};
