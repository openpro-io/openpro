'use strict';

const TABLE_NAME = 'users';

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
      externalId: {
        type: Sequelize.STRING,
        field: 'external_id',
      },
      firstName: {
        type: Sequelize.STRING,
        field: 'first_name',
      },
      lastName: {
        type: Sequelize.STRING,
        field: 'last_name',
      },
      email: {
        type: Sequelize.STRING,
        field: 'email',
      },
      avatarAssetId: {
        type: Sequelize.INTEGER,
        field: 'avatar_asset_id',
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
      fields: ['external_id'],
      unique: true,
    });

    await queryInterface.addIndex(TABLE_NAME, {
      fields: ['avatar_asset_id'],
      unique: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
