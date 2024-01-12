'use strict';

const TABLE_NAME = 'issues';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(TABLE_NAME, 'archived', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['archived'],
      unique: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.column(TABLE_NAME, 'archived');
  },
};
