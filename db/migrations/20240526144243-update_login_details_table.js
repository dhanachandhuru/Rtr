'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('login_details', 'userEmail', {
      type: Sequelize.STRING, // ✅ FIXED: use Sequelize, not DataTypes
      allowNull: false,
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('login_details', 'userEmail', {
      type: Sequelize.STRING, // ✅ FIXED: use Sequelize, not DataTypes
      allowNull: false,
      unique: true
    });
  }
};
