"use strict";
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define(
    "channel",
    {
      name: DataTypes.STRING,
      public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      underscored: true,
    }
  );

  Channel.associate = function (models) {
    Channel.belongsTo(models.team, {
      foreignKey: "teamId",
    });
    Channel.belongsToMany(models.user, {
      through: "channel_member",
      foreignKey: "channelId",
    });
  };
  return Channel;
};
