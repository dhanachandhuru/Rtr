'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "club_events"
      ALTER COLUMN "eventDate" TYPE DATE USING "eventDate"::DATE,
      ALTER COLUMN "eventDate" SET NOT NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    // If you want to revert, update this depending on the original type
    await queryInterface.sequelize.query(`
      ALTER TABLE "club_events"
      ALTER COLUMN "eventDate" TYPE TIMESTAMP USING "eventDate"::TIMESTAMP;
    `);
  }
};
