'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js")

module.exports = sequelize.define("admin_events",{
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
  eventTimeFrom: {
    allowNull: false,
    type: Sequelize.TIME
  },
  eventTimeTo: {
    allowNull: false,
    type: Sequelize.TIME
  },
  eventDate: {
    allowNull: false,
    type: Sequelize.STRING
  },
  eventDescription: {
    allowNull: false,
    type: Sequelize.STRING
  },
  clubId:{
    allowNull: false, 
    type: Sequelize.INTEGER,
  },
  eventType:{
    allowNull: false, 
    type: Sequelize.INTEGER,
  },
  isApproved:{
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  createdBy: {
    allowNull: false,
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
  modelName:"admin_events",
})