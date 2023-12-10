'use strict';

const TABLE_NAME = 'assets';

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
      ownerId: {
        type: Sequelize.INTEGER,
        field: 'owner_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      assetType: {
        type: Sequelize.STRING,
        field: 'asset_type',
      },
      assetSubType: {
        type: Sequelize.STRING,
        field: 'asset_sub_type',
      },
      assetPath: {
        type: Sequelize.STRING,
        field: 'asset_path',
      },
      assetProvider: {
        type: Sequelize.STRING,
        field: 'asset_provider',
      },
      assetFilename: {
        type: Sequelize.STRING,
        field: 'asset_filename',
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

    await queryInterface.addIndex(TABLE_NAME, 'asset_owner_id', {
      fields: 'owner_id',
      unique: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
