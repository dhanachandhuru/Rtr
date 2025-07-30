'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add `isActive` to `user_details` if not exists
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='user_details' AND column_name='isActive'
        ) THEN
          ALTER TABLE "user_details" ADD COLUMN "isActive" INTEGER;
        END IF;
      END
      $$;
    `);

    // Add `isActive` to `club_details` if not exists
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='club_details' AND column_name='isActive'
        ) THEN
          ALTER TABLE "club_details" ADD COLUMN "isActive" INTEGER;
        END IF;
      END
      $$;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Drop both columns if they exist
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='user_details' AND column_name='isActive'
        ) THEN
          ALTER TABLE "user_details" DROP COLUMN "isActive";
        END IF;
      END
      $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='club_details' AND column_name='isActive'
        ) THEN
          ALTER TABLE "club_details" DROP COLUMN "isActive";
        END IF;
      END
      $$;
    `);
  }
};
