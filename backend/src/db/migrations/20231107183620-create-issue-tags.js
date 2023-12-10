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
          model: 'project_tags',
          key: 'id',
        },
      },
      issueId: {
        type: Sequelize.INTEGER,
        field: 'issue_id',
        references: {
          model: 'issues',
          key: 'id',
        },
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        default: Sequelize.fn('NOW'),
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex(TABLE_NAME, 'issue_id', {
      fields: 'issue_id',
      unique: false,
    });
    await queryInterface.addIndex(TABLE_NAME, 'project_tag_id', {
      fields: 'project_tag_id',
      unique: false,
    });
    await queryInterface.addIndex(TABLE_NAME, 'project_issue_tag_id', {
      fields: ['issue_id', 'project_tag_id'],
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
