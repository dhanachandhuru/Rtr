'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   queryInterface.addColumn("cabinet_reports","reportType",{type:Sequelize.INTEGER,allowNull:false})
   queryInterface.addColumn("cabinet_reports","month",{type:Sequelize.INTEGER,allowNull:false})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
