'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      riId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isBoardMember: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      designation: {
        type: Sequelize.INTEGER
      },
      clubId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bloodGroup: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      yearOfRotraction: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profilePhoto: {
        type: Sequelize.STRING,
      },
      instaHandle: {
        type: Sequelize.STRING,
      },
      linkedinHandle: {
        type: Sequelize.STRING,
      },
      facebookHandle: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_details');
  }
};