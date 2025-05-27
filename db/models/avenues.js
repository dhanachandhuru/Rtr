'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js")

module.exports = sequelize.define("avenues",{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  avenue: {
    type: Sequelize.STRING
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
  modelName:"avenues",
})