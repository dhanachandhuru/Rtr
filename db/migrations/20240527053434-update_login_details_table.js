'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove deletedAt from user_details if it exists
    const [userDetailsColumns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_details' AND column_name = 'deletedAt';
    `);
    if (userDetailsColumns.length > 0) {
      await queryInterface.removeColumn('user_details', 'deletedAt');
    }

    // Remove deletedAt from login_details if it exists
    const [loginDetailsColumns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'login_details' AND column_name = 'deletedAt';
    `);
    if (loginDetailsColumns.length > 0) {
      await queryInterface.removeColumn('login_details', 'deletedAt');
    }

    // OPTIONAL: Remove from club_details if it exists
    const [clubDetailsColumns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'club_details' AND column_name = 'deletedAt';
    `);
    if (clubDetailsColumns.length > 0) {
      await queryInterface.removeColumn('club_details', 'deletedAt');
    }

    // Add isApproved to login_details
    await queryInterface.addColumn('login_details', 'isApproved', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Re-add deletedAt to user_details
    await queryInterface.addColumn('user_details', 'deletedAt', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('login_details', 'deletedAt', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('club_details', 'deletedAt', {
      type: Sequelize.DATE,
    });

    // Remove isApproved
    await queryInterface.removeColumn('login_details', 'isApproved');
  }
};
