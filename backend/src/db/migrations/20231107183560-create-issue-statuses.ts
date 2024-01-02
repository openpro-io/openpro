'use strict';

const TABLE_NAME = 'issue_statuses';

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
      name: {
        type: Sequelize.STRING,
        field: 'name',
      },
      createdAt: {
        field: 'created_at',
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['project_id'],
      unique: false,
    });
    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['project_id', 'name'],
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
