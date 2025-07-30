'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Only add the column if it doesn't already exist
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'club_details' AND column_name = 'capacity'
        ) THEN
          ALTER TABLE "club_details" ADD COLUMN "capacity" INTEGER;
        END IF;
      END
      $$;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Only drop the column if it exists
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'club_details' AND column_name = 'capacity'
        ) THEN
          ALTER TABLE "club_details" DROP COLUMN "capacity";
        END IF;
      END
      $$;
    `);
  }
};
