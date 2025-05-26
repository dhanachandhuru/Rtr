'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    queryInterface.addColumn("user_club_designations","userId",{
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: "user_details",
        key: "id"
      }
    })
    queryInterface.removeColumn('user_club_designations', 'clubId', {
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
