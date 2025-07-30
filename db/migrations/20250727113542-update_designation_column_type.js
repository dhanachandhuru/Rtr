'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user_details', 'designation', {
      type: Sequelize.STRING,
      allowNull: true, // or false if it's required
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user_details', 'designation', {
      type: Sequelize.INTEGER,
      allowNull: true, // match previous state
    });
  }
};
