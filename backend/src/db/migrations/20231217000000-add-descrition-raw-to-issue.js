'use strict';

const TABLE_NAME = 'issues';
const COLUMN_NAME = 'description_raw';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(TABLE_NAME, COLUMN_NAME, {
      type: Sequelize.BLOB,
      defaultValue: false,
    });

    await queryInterface.addIndex(TABLE_NAME, {
      fields: [COLUMN_NAME],
      unique: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.column(TABLE_NAME, COLUMN_NAME);
  },
};
