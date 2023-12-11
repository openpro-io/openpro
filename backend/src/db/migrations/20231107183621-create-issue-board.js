'use strict';

const TABLE_NAME = 'issue_boards';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TABLE_NAME, {
      boardId: {
        type: Sequelize.INTEGER,
        field: 'board_id',
        references: {
          model: {
            tableName: 'boards',
            schema: 'public',
          },
          key: 'id',
        },
      },
      issueId: {
        type: Sequelize.INTEGER,
        field: 'issue_id',
        references: {
          model: {
            tableName: 'issues',
            schema: 'public',
          },
          key: 'id',
        },
      },
      position: {
        type: Sequelize.INTEGER,
        field: 'position',
      },
    });

    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['board_id'],
      unique: false,
    });
    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['issue_id', 'board_id'],
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
