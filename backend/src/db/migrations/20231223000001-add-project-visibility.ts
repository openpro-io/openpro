'use strict';

const TABLE_NAME = 'projects';
const COLUMN_NAME = 'visibility';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(TABLE_NAME, COLUMN_NAME, {
      type: Sequelize.STRING,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME);
  },
};
