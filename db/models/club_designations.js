'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js")

module.exports = sequelize.define("club_designations",
{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  clubId: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  designationName: {
    allowNull: false,
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
  modelName:"club_designations",
})
