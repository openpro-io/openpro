'use strict';

const TABLE_NAME = 'users';
const COLUMN_NAME = 'settings';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(TABLE_NAME, COLUMN_NAME, {
      type: Sequelize.JSONB,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME);
  },
};
