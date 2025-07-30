'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js")

module.exports = sequelize.define("login_details",{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  userType: {
    type: Sequelize.ENUM('1', '2', '3', '4', '5'),
    allowNull: false,
    validate: {
      notNull: {
        msg: "select atleast one user type"
      },
      notEmpty: {
        msg: "select atleast one user type",
      },
      isIn: {
        args: [['1', '2', '3', '4','5']],
        msg: "userType must be one of: 1, 2, 3, 4, 5"
      }
    }
  },
  userEmail: {
    type: Sequelize.STRING,
    allowNull:false,
    notEmpty:true,
    validate:{
      notNull:{
        msg:"User Email Cannot be empty"
      },
      notEmpty:{
        msg:"User email cannot be empty",
      },
    }
  },
  userPassword: {
    type: Sequelize.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg:"password Cannot be empty"
      },
      notEmpty:{
        msg:"password cannot be empty",
      }
    }
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull:true,
    references:{
      model:"user_details",
      key:"id"
    }
  },
  clubId: {
    type: Sequelize.INTEGER,
    allowNull:true,
  },
  isApproved: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
},{
  freezeTableName:true,
  modelName:"login_details",
})