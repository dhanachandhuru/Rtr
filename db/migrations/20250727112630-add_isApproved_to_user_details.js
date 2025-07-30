'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'user_details'
          AND column_name = 'isApproved'
        ) THEN
          ALTER TABLE "user_details"
          ADD COLUMN "isApproved" BOOLEAN DEFAULT FALSE;
        END IF;
      END;
      $$;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'user_details'
          AND column_name = 'isApproved'
        ) THEN
          ALTER TABLE "user_details"
          DROP COLUMN "isApproved";
        END IF;
      END;
      $$;
    `);
  }
};
