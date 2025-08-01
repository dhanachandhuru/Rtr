'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js");

module.exports = sequelize.define("district_events", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  eventName: {
    allowNull: false,
    type: Sequelize.STRING
  },
  topic: {
    allowNull: false,
    type: Sequelize.STRING
  },
  venue: {
    allowNull: false,
    type: Sequelize.STRING
  },
  date: {
    allowNull: true,
    type: Sequelize.STRING
  },
  hostedBy: {
    allowNull: true,
    type: Sequelize.STRING
  },
  photo: {
    allowNull: true,
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true,
  modelName: "district_events"
});
