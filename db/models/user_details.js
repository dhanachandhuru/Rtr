'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js")

module.exports = sequelize.define("user_details",{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate:{
      notNull:{
        msg:"User name Cannot be empty"
      },
      notEmpty:{
        msg:"User name cannot be empty",
      },
    }
  },
  userMobile: {
    type: Sequelize.STRING,
  },
  riId: {
    type: Sequelize.STRING,
    allowNull: false,
    validate:{
      notNull:{
        msg:"RI ID Cannot be empty"
      },
      notEmpty:{
        msg:"RI ID cannot be empty",
      }
    }
  },
  isBoardMember: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate:{
      notNull:{
        msg:"Select if Board member or not"
      },
      notEmpty:{
        msg:"Slect if board member or not",
      }
    }
  },
  designation: {
    type: Sequelize.INTEGER
  },
  clubId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate:{
      notNull:{
        msg:"Select any one club"
      },
      notEmpty:{
        msg:"Select any one club",
      }
    }
  },
  bloodGroup: {
    type: Sequelize.STRING,
  },
  yearOfRotraction: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate:{
      notNull:{
        msg:"year of rotraction Cannot be empty"
      },
      notEmpty:{
        msg:"year of rotraction cannot be empty",
      }
    }
  },
  address: {
    type: Sequelize.STRING,
  },
  profilePhoto: {
    type: Sequelize.STRING,
  },
  instaHandle: {
    type: Sequelize.STRING,
  },
  linkedinHandle: {
    type: Sequelize.STRING,
  },
  facebookHandle: {
    type: Sequelize.STRING,
  },
  createdBy:{
    type:Sequelize.INTEGER
  },
  isActive:{
    type:Sequelize.INTEGER
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  isApproved: {
  type: Sequelize.BOOLEAN,
  defaultValue: false, // By default, not approved
  },
},{
  freezeTableName:true,
  modelName:"user_details",
})
