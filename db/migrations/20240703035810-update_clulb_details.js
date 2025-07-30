'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add "eventType" column if it doesn't exist
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'club_events' AND column_name = 'eventType'
        ) THEN
          ALTER TABLE "club_events" ADD COLUMN "eventType" INTEGER;
        END IF;
      END
      $$;
    `);

    // Add "isApproved" column if it doesn't exist
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'club_events' AND column_name = 'isApproved'
        ) THEN
          ALTER TABLE "club_events" ADD COLUMN "isApproved" INTEGER;
        END IF;
      END
      $$;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Drop "eventType" column if it exists
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'club_events' AND column_name = 'eventType'
        ) THEN
          ALTER TABLE "club_events" DROP COLUMN "eventType";
        END IF;
      END
      $$;
    `);

    // Drop "isApproved" column if it exists
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'club_events' AND column_name = 'isApproved'
        ) THEN
          ALTER TABLE "club_events" DROP COLUMN "isApproved";
        END IF;
      END
      $$;
    `);
  }
};
