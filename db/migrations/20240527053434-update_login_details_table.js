'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.removeColumn(
      'user_details',
      'deletedAt'
    );
    queryInterface.removeColumn(
      'login_details',
      'deletedAt'
    );
    queryInterface.removeColumn(
      'club_details',
      'deletedAt'
    );
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
