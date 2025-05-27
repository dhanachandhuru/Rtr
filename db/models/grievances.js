'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js")

module.exports = sequelize.define("grievances",{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  file: {
    type: Sequelize.STRING
  },
  isViewed: {
    type: Sequelize.INTEGER
  },
  response: {
    type: Sequelize.STRING
  },
  createdBy: {
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
  modelName:"grievances",
})
