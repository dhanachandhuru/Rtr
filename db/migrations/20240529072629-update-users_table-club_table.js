'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check and add column to user_details
    const [userDetailsColumnCheck] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_details' 
        AND column_name = 'createdBy'
    `);

    if (userDetailsColumnCheck.length === 0) {
      await queryInterface.addColumn('user_details', 'createdBy', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    // Check and add column to club_details
    const [clubDetailsColumnCheck] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'club_details' 
        AND column_name = 'createdBy'
    `);

    if (clubDetailsColumnCheck.length === 0) {
      await queryInterface.addColumn('club_details', 'createdBy', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_details', 'createdBy');
    await queryInterface.removeColumn('club_details', 'createdBy');
  }
};
