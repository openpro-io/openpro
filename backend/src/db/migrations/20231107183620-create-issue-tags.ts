'use strict';

const TABLE_NAME = 'issue_tags';

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
      projectTagId: {
        type: Sequelize.INTEGER,
        field: 'project_tag_id',
        references: {
          model: {
            tableName: 'project_tags',
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
      fields: ['project_tag_id'],
      unique: false,
    });
    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['issue_id', 'project_tag_id'],
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
