'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column already exists
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'cabinet_reports' AND column_name = 'photographs';
    `);

    if (columns.length === 0) {
      await queryInterface.addColumn('cabinet_reports', 'photographs', {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true, // Optional: adjust based on your needs
      });
    } else {
      console.log("⚠️ Column 'photographs' already exists. Skipping.");
    }
  },

  async down(queryInterface, Sequelize) {
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'cabinet_reports' AND column_name = 'photographs';
    `);

    if (columns.length > 0) {
      await queryInterface.removeColumn('cabinet_reports', 'photographs');
    }
  }
};
