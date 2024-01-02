'use strict';

const TABLE_NAME = 'issues';

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
      projectId: {
        type: Sequelize.INTEGER,
        field: 'project_id',
        references: {
          model: {
            tableName: 'projects',
            schema: 'public',
          },
          key: 'id',
        },
      },
      issueStatusId: {
        type: Sequelize.INTEGER,
        field: 'issue_status_id',
        references: {
          model: {
            tableName: 'issue_statuses',
            schema: 'public',
          },
          key: 'id',
        },
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
      assigneeId: {
        type: Sequelize.INTEGER,
        field: 'assignee_id',
        references: {
          model: {
            tableName: 'users',
            schema: 'public',
          },
          key: 'id',
        },
      },
      title: {
        type: Sequelize.STRING,
        field: 'title',
      },
      description: {
        type: Sequelize.TEXT,
        field: 'description',
      },
      priority: {
        type: Sequelize.INTEGER,
        field: 'priority',
        defaultValue: 3,
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
      fields: ['project_id'],
      unique: false,
    });
    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['assignee_id'],
      unique: false,
    });
    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['reporter_id'],
      unique: false,
    });
    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['issue_status_id'],
      unique: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
