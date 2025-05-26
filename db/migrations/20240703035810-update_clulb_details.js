'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn("club_events","eventType",{
      type:Sequelize.INTEGER
    })
    queryInterface.addColumn("club_events","isApproved",{
      type:Sequelize.INTEGER
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
