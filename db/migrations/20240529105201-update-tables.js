'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn("user_details","address",{type: Sequelize.STRING,allowNull:true})
    queryInterface.changeColumn("user_details","bloodGroup",{type: Sequelize.STRING,allowNull:true})
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
