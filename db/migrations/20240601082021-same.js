'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn("login_details","userId",{
    type: Sequelize.INTEGER,
    allowNull:true,
    references:{
      model:"user_details",
      key:"id"
    }
    })

    queryInterface.changeColumn("login_details","clubId",{
      type: Sequelize.INTEGER,
      allowNull:true,
      references:{
        model:"club_details",
        key:"id"
      }
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
