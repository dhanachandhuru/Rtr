'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cabinet_reports', {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cabinet_reports');
  }
};