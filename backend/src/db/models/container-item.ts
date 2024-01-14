import { DataTypes, Sequelize } from 'sequelize';

import { ContainerItem } from './types.js';

export default (sequelize: Sequelize) => {
  ContainerItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      containerId: {
        type: DataTypes.INTEGER,
        field: 'container_id',
      },
      issueId: {
        type: DataTypes.INTEGER,
        field: 'issue_id',
      },
      position: {
        type: DataTypes.INTEGER,
        field: 'position',
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
      tableName: 'container_items',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { unique: false, fields: ['container_id'] },
        { unique: false, fields: ['issue_id'] },
        { unique: true, fields: ['container_id', 'issue_id'] },
      ],
    }
  );

  ContainerItem.associate = ({ BoardContainer, Issue }) => {
    ContainerItem.belongsTo(BoardContainer, {
      foreignKey: 'container_id',
      as: 'container',
    });
    ContainerItem.belongsTo(Issue, {
      foreignKey: 'issue_id',
      as: 'issue',
    });
  };

  return ContainerItem;
};
