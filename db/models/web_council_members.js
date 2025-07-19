'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js");

module.exports = sequelize.define("council_members", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING
  },
  role: {
    allowNull: false,
    type: Sequelize.STRING
  },
  position: {
    allowNull: false,
    type: Sequelize.STRING
  },
  photo: {
    allowNull: true,
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true,
  modelName: "council_members"
});
