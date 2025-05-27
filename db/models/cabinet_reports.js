'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js")

module.exports = sequelize.define("cabinet_reports",{
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
  reportType: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  month: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  description: {
    allowNull: false,
    type: Sequelize.STRING
  },
  rotractorsAttended: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  rotariansAttended: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  beneficiaries: {
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
  hoursSpend: {
    allowNull: false,
    type: Sequelize.FLOAT
  },
  venue: {
    allowNull: false,
    type: Sequelize.STRING
  },
  userId:{
    allowNull: false,
    type: Sequelize.INTEGER
  },
  photographs:{
  	type:Sequelize.ARRAY(Sequelize.STRING)
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  year:{
    type: Sequelize.STRING
  },
  gDriveFolder: {
    type: Sequelize.STRING
  }
},{
  freezeTableName:true,
  modelName:"cabinet_reports",
})
