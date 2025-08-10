'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js")

module.exports = sequelize.define("club_reports",{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  reportName: {
    allowNull: false,
    type: Sequelize.STRING
  },
  description: {
  allowNull: false,
  type: Sequelize.TEXT('long') // 'long' works in MySQL, for large text storage
},
  rotractorsAttended: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  rotariansAttended: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  visitingRotractors: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  guests: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  photographs: {
    allowNull: true,
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  beneficiaries: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  reportType: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  month: {
    allowNull: false,
    type: Sequelize.STRING
  },
  avenue: {
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
  },
  clubId: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  year:{
    type: Sequelize.STRING
  },
  gDriveFolder:{
    type: Sequelize.STRING
  }
},{
  freezeTableName:true,
  modelName:"club_reports",
})