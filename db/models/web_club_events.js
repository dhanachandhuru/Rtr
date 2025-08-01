'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js");

module.exports = sequelize.define("web_club_events", {
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
  description: {
    allowNull: false,
    type: Sequelize.STRING
  },
  date: {
    allowNull: true,
    type: Sequelize.STRING
  },
  time: {
    allowNull: true,
    type: Sequelize.STRING
  },
  venue: {
    allowNull: false,
    type: Sequelize.STRING
  },
  sponsorBy: {
    allowNull: true,
    type: Sequelize.STRING
  },
  photo: {
    allowNull: true,
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true,
  modelName: "web_club_events"
});
