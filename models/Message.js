"use strict";
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "message",
    {
      text: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );

  Message.associate = function (models) {
    Message.belongsTo(models.channel, {
      foreignKey: "channelId",
    });
    Message.belongsTo(models.user, {
      foreignKey: "userId",
    });
  };
  return Message;
};
