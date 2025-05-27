'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('login_details', 'user_type', 'userType');
    await queryInterface.renameColumn('login_details', 'user_email', 'userEmail');
    await queryInterface.renameColumn('login_details', 'user_password', 'userPassword');
    await queryInterface.renameColumn('login_details', 'user_id', 'userId');
  },

  async down (queryInterface, Sequelize) {
  }
};
