'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('club_details',"clubLogo",{
      type:Sequelize.STRING
    })
    queryInterface.changeColumn('club_details',"presidentId",{
      type:Sequelize.STRING
    })
    queryInterface.changeColumn('club_details',"secretaryId",{
      type:Sequelize.STRING
    })
    queryInterface.changeColumn('club_details',"parentRotaryName",{
      type:Sequelize.STRING
    })
    queryInterface.changeColumn('club_details',"installationDate",{
      type:Sequelize.STRING
    })
    queryInterface.changeColumn('club_details',"cabinetMentor",{
      type:Sequelize.STRING
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
