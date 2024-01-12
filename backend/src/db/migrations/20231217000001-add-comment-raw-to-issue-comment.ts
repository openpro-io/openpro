'use strict';

const TABLE_NAME = 'issue_comments';
const COLUMN_NAME = 'comment_raw';

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
