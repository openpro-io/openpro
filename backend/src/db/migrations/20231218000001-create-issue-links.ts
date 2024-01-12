'use strict';

const TABLE_NAME = 'issues_links';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      linkType: {
        type: Sequelize.STRING,
        field: 'link_type',
      },
      linkedIssueId: {
        type: Sequelize.INTEGER,
        field: 'linked_issue_id',
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
      fields: ['link_type'],
      unique: false,
    });
    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['linked_issue_id'],
      unique: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
