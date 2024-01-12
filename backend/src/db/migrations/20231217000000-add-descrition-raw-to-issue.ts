'use strict';

const TABLE_NAME = 'issues';
const COLUMN_NAME = 'description_raw';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(TABLE_NAME, COLUMN_NAME, {
      type: Sequelize.BLOB,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.column(TABLE_NAME, COLUMN_NAME);
  },
};
