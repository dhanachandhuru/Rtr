'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'cabinet_reports'
    `);

    const columnNames = columns.map(col => col.column_name);

    if (!columnNames.includes('photographs')) {
      await queryInterface.addColumn('cabinet_reports', 'photographs', {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      });
    } else {
      console.log("⚠️ Column 'photographs' already exists. Skipping.");
    }
  },

  async down(queryInterface, Sequelize) {
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'cabinet_reports'
    `);

    const columnNames = columns.map(col => col.column_name);

    if (columnNames.includes('photographs')) {
      await queryInterface.removeColumn('cabinet_reports', 'photographs');
    }
  }
};
