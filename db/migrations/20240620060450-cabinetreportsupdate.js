'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'cabinet_reports'
    `);

    const columnNames = columns.map(col => col.column_name);

    if (!columnNames.includes('reportType')) {
      await queryInterface.addColumn('cabinet_reports', 'reportType', {
        type: Sequelize.INTEGER,
        allowNull: false
      });
    } else {
      console.log("⚠️ Column 'reportType' already exists. Skipping.");
    }

    if (!columnNames.includes('month')) {
      await queryInterface.addColumn('cabinet_reports', 'month', {
        type: Sequelize.INTEGER,
        allowNull: false
      });
    } else {
      console.log("⚠️ Column 'month' already exists. Skipping.");
    }
  },

  async down(queryInterface, Sequelize) {
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'cabinet_reports'
    `);

    const columnNames = columns.map(col => col.column_name);

    if (columnNames.includes('reportType')) {
      await queryInterface.removeColumn('cabinet_reports', 'reportType');
    }

    if (columnNames.includes('month')) {
      await queryInterface.removeColumn('cabinet_reports', 'month');
    }
  }
};
