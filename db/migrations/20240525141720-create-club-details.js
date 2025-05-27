'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize){
    await queryInterface.createTable('club_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clubName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      charterId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      charterDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      groupId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      clubLogo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      presidentId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      secretaryId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      installationDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      parentRotaryName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      staffCoordinator: {
        type: Sequelize.STRING
      },
      staffCoordinatorNumber: {
        type: Sequelize.STRING
      },
      cabinetMentor: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      assets: {
        type: Sequelize.STRING
      },
      facebookHandle: {
        type: Sequelize.STRING
      },
      instagramHandle: {
        type: Sequelize.STRING
      },
      linkedinHandle: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt:{
        type:Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('club_details');
  }
};