'use strict';

const TABLE_NAME = 'project_tags';

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
          model: 'projects',
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
      name: {
        type: Sequelize.STRING,
        field: 'name',
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

    await queryInterface.addIndex(TABLE_NAME, 'project_id', {
      fields: 'project_id',
      unique: false,
    });
    await queryInterface.addIndex(TABLE_NAME, 'name', {
      fields: 'name',
      unique: false,
    });
    await queryInterface.addIndex(TABLE_NAME, 'project_tag_name', {
      fields: ['name', 'project_id'],
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
