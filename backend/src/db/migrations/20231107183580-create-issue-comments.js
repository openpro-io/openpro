'use strict';

const TABLE_NAME = 'issue_comments';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reporterId: {
        type: Sequelize.INTEGER,
        field: 'reporter_id',
        references: {
          model: {
            tableName: 'users',
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
      comment: {
        type: Sequelize.TEXT,
        field: 'comment',
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['issue_id'],
      unique: false,
    });
    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['reporter_id'],
      unique: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
