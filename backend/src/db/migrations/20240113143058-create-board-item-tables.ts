'use strict';

const CONTAINER_TABLE_NAME = 'board_containers';
const ITEMS_TABLE_NAME = 'container_items';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(CONTAINER_TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      boardId: {
        type: Sequelize.INTEGER,
        field: 'board_id',
        references: {
          model: {
            tableName: 'boards',
            schema: 'public',
          },
          key: 'id',
        },
      },
      title: {
        type: Sequelize.STRING,
        field: 'title',
      },
      position: {
        type: Sequelize.INTEGER,
        field: 'position',
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

    await queryInterface.addIndex(CONTAINER_TABLE_NAME, {
      fields: ['board_id'],
      unique: false,
    });

    await queryInterface.createTable(ITEMS_TABLE_NAME, {
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
      containerId: {
        type: Sequelize.INTEGER,
        field: 'container_id',
        references: {
          model: {
            tableName: CONTAINER_TABLE_NAME,
            schema: 'public',
          },
          key: 'id',
        },
      },
      position: {
        type: Sequelize.INTEGER,
        field: 'position',
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

    await queryInterface.addIndex(ITEMS_TABLE_NAME, {
      fields: ['container_id'],
      unique: false,
    });

    await queryInterface.addIndex(ITEMS_TABLE_NAME, {
      fields: ['issue_id'],
      unique: false,
    });

    await queryInterface.addIndex(ITEMS_TABLE_NAME, {
      fields: ['container_id', 'issue_id'],
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(CONTAINER_TABLE_NAME);
    await queryInterface.dropTable(ITEMS_TABLE_NAME);
  },
};
