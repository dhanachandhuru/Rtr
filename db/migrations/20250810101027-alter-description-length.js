'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('club_reports', 'description', {
      type: Sequelize.TEXT, // TEXT for Postgres, TEXT('long') for MySQL
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('club_reports', 'description', {
      type: Sequelize.STRING, // revert to old
      allowNull: false
    });
  }
};
