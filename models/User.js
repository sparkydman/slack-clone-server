"use strict";
import bcrypt from "bcrypt";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        isAlphanumeric: {
          arrgs: true,
          msg: "Username must contain only letters and numbers",
        },
        validate: {
          len: {
            args: [5, 25],
            msg: "Username must be between 5 and 25 characters long",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Invalid email",
          },
        },
      },
      password: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );
  User.afterValidate("hashPasswordAfterHook", async (user) => {
    const hashPassword = await bcrypt.hash(user.password, 12);
    user.password = hashPassword;
  });

  User.associate = function (models) {
    User.belongsToMany(models.team, {
      through: models.member,
      foreignKey: "userId",
    });
    User.belongsToMany(models.channel, {
      through: "channel_member",
      foreignKey: "userId",
    });
  };

  return User;
};
