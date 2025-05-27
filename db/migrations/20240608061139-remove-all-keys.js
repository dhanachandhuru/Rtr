'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("club_designations","clubId",{allowNull: false,
    type: Sequelize.INTEGER})
    await queryInterface.changeColumn("login_details","userId",{type: Sequelize.INTEGER,
      allowNull:true})
    await queryInterface.changeColumn("login_details","clubId",{type: Sequelize.INTEGER,
      allowNull:true})
    await queryInterface.changeColumn("user_club_designations","clubDesignationId",{type: Sequelize.INTEGER,
      allowNull:true})
      await queryInterface.changeColumn("user_club_designations","userId",{type: Sequelize.INTEGER,
        allowNull:true})
              
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
