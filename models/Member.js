"use strict";
module.exports = (sequelize) => {
  const Member = sequelize.define("member");
  return Member;
};
