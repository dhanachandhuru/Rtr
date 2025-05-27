'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js")

module.exports = sequelize.define("club_details",{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  clubName: {
    type: Sequelize.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg:"Club name cannot be empty"
      },
      notEmpty:{
        msg:"Club name cannot be empty",
      }
    }
  },
  charterId: {
    type: Sequelize.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg:"Charter id cannot be empty"
      },
      notEmpty:{
        msg:"Charter id cannot be empty",
      }
    }
  },
  charterDate: {
    type: Sequelize.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg:"Charter date cannot be empty"
      },
      notEmpty:{
        msg:"Charter date cannot be empty",
      }
    }
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull:false,
    validate:{
      notNull:{
        msg:"Group cannot be empty"
      },
      notEmpty:{
        msg:"Group cannot be empty",
      }
    }
  },
  clubType:{
    type: Sequelize.INTEGER,
    allowNull:false,
    validate:{
      notNull:{
        msg:"Specify Club Type"
      },
      notEmpty:{
        msg:"Specify Club Type",
      }
    }
  },
  clubLogo: {
    type: Sequelize.STRING,
  },
  presidentId: {
    type: Sequelize.INTEGER,
  },
  secretaryId: {
    type: Sequelize.INTEGER
  },
  installationDate: {
    type: Sequelize.DATE
  },
  parentRotaryName: {
    type: Sequelize.STRING
  },
  staffCoordinator: {
    type: Sequelize.STRING
  },
  staffCoordinatorNumber: {
    type: Sequelize.STRING
  },
  cabinetMentor: {
    type: Sequelize.INTEGER,
  },
  assets: {
    type: Sequelize.STRING
  },
  facebookHandle: {
    type: Sequelize.STRING
  },
  instagramHandle: {
    type: Sequelize.STRING
  },
  linkedinHandle: {
    type: Sequelize.STRING
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  createdBy:{
    type:Sequelize.INTEGER
  },
  isActive:{
    type:Sequelize.INTEGER
  },
  capacity:{
    type:Sequelize.INTEGER
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
},{
  freezeTableName:true,
  modelName:"club_details",
})