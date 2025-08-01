// models/resources.js
'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js");

module.exports = sequelize.define(
  "resources",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    description: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    filelink: {
  type: Sequelize.STRING,
  allowNull: true, // <-- ensure this is true
},

    fileName: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    mimeType: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    fileData: {
  allowNull: true,
  type: Sequelize.BLOB, // no "long" — for Postgres this is just bytea
},
    uploadedBy: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    freezeTableName: true,
    modelName: "resources",
  }
);
