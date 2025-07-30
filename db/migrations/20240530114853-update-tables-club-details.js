'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if column exists
    const [results] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='club_details' AND column_name='clubType';
    `);

    // If not found, add the column
    if (results.length === 0) {
      await queryInterface.addColumn('club_details', 'clubType', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    } else {
      console.log("✅ Column 'clubType' already exists. Skipping...");
    }
  },

  async down(queryInterface, Sequelize) {
    const [results] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='club_details' AND column_name='clubType';
    `);

    if (results.length > 0) {
      await queryInterface.removeColumn('club_details', 'clubType');
    } else {
      console.log("⚠️ Column 'clubType' does not exist. Nothing to remove.");
    }
  }
};
