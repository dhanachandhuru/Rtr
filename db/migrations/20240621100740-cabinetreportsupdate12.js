'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check and add 'eventTimeFrom'
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'club_events' AND column_name = 'eventTimeFrom';
    `);

    if (columns.length === 0) {
      await queryInterface.addColumn('club_events', 'eventTimeFrom', {
        type: Sequelize.TIME,
        allowNull: true, // Adjust as needed
      });
    } else {
      console.log("⚠️ Column 'eventTimeFrom' already exists. Skipping.");
    }

    // Check and add 'eventTimeTo'
    const [columns2] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'club_events' AND column_name = 'eventTimeTo';
    `);

    if (columns2.length === 0) {
      await queryInterface.addColumn('club_events', 'eventTimeTo', {
        type: Sequelize.TIME,
        allowNull: true,
      });
    } else {
      console.log("⚠️ Column 'eventTimeTo' already exists. Skipping.");
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove only if exists
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'club_events' AND column_name = 'eventTimeFrom';
    `);

    if (columns.length > 0) {
      await queryInterface.removeColumn('club_events', 'eventTimeFrom');
    }

    const [columns2] = await queryInterface.sequelize.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'club_events' AND column_name = 'eventTimeTo';
    `);

    if (columns2.length > 0) {
      await queryInterface.removeColumn('club_events', 'eventTimeTo');
    }
  }
};
