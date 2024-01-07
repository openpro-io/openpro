import { DataTypes, Sequelize } from 'sequelize';

import { User } from './types.js';

export default (sequelize: Sequelize) =>
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      externalId: {
        type: DataTypes.STRING,
        field: 'external_id',
      },
      firstName: {
        type: DataTypes.STRING,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'last_name',
      },
      email: {
        type: DataTypes.STRING,
        field: 'email',
      },
      avatarAssetId: {
        type: DataTypes.INTEGER,
        field: 'avatar_asset_id',
        references: {
          model: 'assets',
          key: 'id',
        },
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
      tableName: 'users',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [{ unique: true, fields: ['external_id'] }],
    }
  );
