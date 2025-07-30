'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column 'clubId' exists
    const [results] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'club_reports' AND column_name = 'clubId';
    `);

    // Only add the column if it doesn't exist
    if (results.length === 0) {
      await queryInterface.addColumn('club_reports', 'clubId', {
        type: Sequelize.INTEGER,
        allowNull: true, // Or false based on your requirement
        references: {
          model: 'club_details',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    } else {
      console.log("⚠️ Column 'clubId' already exists in 'club_reports'. Skipping add.");
    }
  },

  async down(queryInterface, Sequelize) {
    // Safe rollback: remove column only if it exists
    const [results] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'club_reports' AND column_name = 'clubId';
    `);

    if (results.length > 0) {
      await queryInterface.removeColumn('club_reports', 'clubId');
    } else {
      console.log("⚠️ Column 'clubId' does not exist. Nothing to remove.");
    }
  }
};
