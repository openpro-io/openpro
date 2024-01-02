'use strict';

export default (sequelize, DataTypes) => {
  const Asset = sequelize.define(
    'Asset',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        field: 'owner_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      assetType: {
        type: DataTypes.STRING,
        field: 'asset_type',
      },
      assetSubType: {
        type: DataTypes.STRING,
        field: 'asset_sub_type',
      },
      assetPath: {
        type: DataTypes.STRING,
        field: 'asset_path',
      },
      assetProvider: {
        type: DataTypes.STRING,
        field: 'asset_provider',
      },
      assetFilename: {
        type: DataTypes.STRING,
        field: 'asset_filename',
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'assets',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [{ unique: false, fields: ['owner_id'] }],
    }
  );

  return Asset;
};
