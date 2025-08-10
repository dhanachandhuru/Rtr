// db/models/club_report_pdfs.js
'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require("../../config/db_connection.js");

module.exports = sequelize.define("club_report_pdfs", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reportId: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  clubId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  pdfFileName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pdfPath: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pdfBuffer: {
    type: Sequelize.BLOB('long'),
    allowNull: true
  },
  fileSize: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  generatedAt: {
    type: Sequelize.DATE,
    allowNull: true
  },
  isMultiReport: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true,
  modelName: "club_report_pdfs",
});
