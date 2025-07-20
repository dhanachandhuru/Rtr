'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js");

module.exports = sequelize.define("trainer_members", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  trainerName: {
    allowNull: false,
    type: Sequelize.STRING
  },
  club: {
    allowNull: false,
    type: Sequelize.STRING
  },
  zone: {
    allowNull: false,
    type: Sequelize.STRING
  },
  photo: {
    allowNull: true,
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true,
  modelName: "trainer_members"
});
