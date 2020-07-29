"use strict";
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define(
    "team",
    {
      name: { type: DataTypes.STRING, unique: true },
    },
    {
      underscored: true,
    }
  );

  Team.associate = function (models) {
    Team.belongsToMany(models.user, {
      through: models.member,
      foreignKey: "teamId",
    });
    Team.belongsTo(models.user, {
      foreignKey: "owner",
    });
  };
  return Team;
};
