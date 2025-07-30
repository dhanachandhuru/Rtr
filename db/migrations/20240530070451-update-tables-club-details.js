'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [columnExists] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'club_details' 
      AND column_name = 'clubType';
    `);

    if (columnExists.length === 0) {
      await queryInterface.addColumn('club_details', 'clubType', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Drop column if exists
    const [columnExists] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'club_details' 
      AND column_name = 'clubType';
    `);

    if (columnExists.length > 0) {
      await queryInterface.removeColumn('club_details', 'clubType');
    }
  }
};
