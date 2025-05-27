'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js")

module.exports = sequelize.define("cabinet_events",{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  eventName: {
    type: Sequelize.STRING
  },
  eventTimeFrom: {
    type: Sequelize.TIME
  },
  eventTimeTo: {
    type: Sequelize.TIME
  },
  eventDate: {
    type: Sequelize.STRING
  },
  eventDescription: {
    type: Sequelize.STRING
  },
  userId: {
    type: Sequelize.INTEGER
  },
  eventType: {
    type: Sequelize.INTEGER
  },
  isApproved: {
    type: Sequelize.INTEGER
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
},{
  freezeTableName:true,
  modelName:"cabinet_events",
})