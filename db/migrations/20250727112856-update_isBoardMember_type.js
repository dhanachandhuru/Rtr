'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add a new temporary column
    await queryInterface.addColumn('user_details', 'isBoardMember_temp', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    // 2. Copy and cast data from integer to boolean
    await queryInterface.sequelize.query(`
      UPDATE "user_details"
      SET "isBoardMember_temp" = CASE
        WHEN "isBoardMember" = 1 THEN true
        ELSE false
      END;
    `);

    // 3. Drop the old integer column
    await queryInterface.removeColumn('user_details', 'isBoardMember');

    // 4. Rename the temp column to the original name
    await queryInterface.renameColumn('user_details', 'isBoardMember_temp', 'isBoardMember');
  },

  async down(queryInterface, Sequelize) {
    // 1. Add back the column as integer
    await queryInterface.addColumn('user_details', 'isBoardMember_temp', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });

    // 2. Convert boolean back to integer
    await queryInterface.sequelize.query(`
      UPDATE "user_details"
      SET "isBoardMember_temp" = CASE
        WHEN "isBoardMember" = true THEN 1
        ELSE 0
      END;
    `);

    // 3. Drop boolean column
    await queryInterface.removeColumn('user_details', 'isBoardMember');

    // 4. Rename integer column back
    await queryInterface.renameColumn('user_details', 'isBoardMember_temp', 'isBoardMember');
    await queryInterface.changeColumn('user_details', 'designation', {
  type: Sequelize.STRING
});

  },
};
