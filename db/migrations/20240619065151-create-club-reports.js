'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('club_reports', {
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
      visitingRotractors: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      guests: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      photographs: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      beneficiaries: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      reportType: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      month: {
        allowNull: false,
        type: Sequelize.STRING
      },
      avenue: {
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
    await queryInterface.dropTable('club_reports');
  }
};