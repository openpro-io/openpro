'use strict';

const TABLE_NAME = 'project_custom_fields';

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
      fieldName: {
        type: Sequelize.STRING,
        field: 'field_name',
      },
      fieldType: {
        type: Sequelize.STRING,
        field: 'field_type',
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
