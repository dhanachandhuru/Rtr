'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn("club_reports","gDriveFolder",{
      type:Sequelize.STRING
    })
    queryInterface.addColumn("cabinet_reports","gDriveFolder",{
      type:Sequelize.STRING
    })
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
