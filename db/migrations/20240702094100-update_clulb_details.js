'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('club_reports',"photographs",{
      type:Sequelize.ARRAY(Sequelize.STRING)
    })
    queryInterface.changeColumn('cabinet_reports',"photographs",{
      type:Sequelize.ARRAY(Sequelize.STRING)
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
