'use strict';

const TABLE_NAME = 'boards';

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
      },
      name: {
        type: Sequelize.STRING,
        field: 'name',
      },
      style: {
        type: Sequelize.STRING,
        field: 'style',
      },
      viewState: {
        type: Sequelize.JSONB,
        field: 'view_state',
      },
      status: Sequelize.STRING,
      backlogEnabled: {
        type: Sequelize.BOOLEAN,
        field: 'backlog_enabled',
        defaultValue: false,
      },
      settings: {
        type: Sequelize.JSONB,
        field: 'settings',
      },
      containerOrder: {
        type: Sequelize.JSONB,
        field: 'container_order',
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
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
