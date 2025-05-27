'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('login_details', 'userEmail', {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.changeColumn('login_details', 'userEmail', {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    });
  }
};
