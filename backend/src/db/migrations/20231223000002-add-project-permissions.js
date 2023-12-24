'use strict';

const TABLE_NAME = 'project_permissions';

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
      userId: {
        type: Sequelize.INTEGER,
        field: 'user_id',
        references: {
          model: {
            tableName: 'users',
            schema: 'public',
          },
          key: 'id',
        },
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
    });

    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['project_id', 'user_id'],
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
