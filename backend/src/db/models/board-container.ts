import { DataTypes, Sequelize } from 'sequelize';

import { BoardContainer } from './types.js';

export default (sequelize: Sequelize) => {
  BoardContainer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      boardId: {
        type: DataTypes.INTEGER,
        field: 'board_id',
      },
      position: {
        type: DataTypes.INTEGER,
        field: 'position',
      },
      title: {
        type: DataTypes.STRING,
        field: 'title',
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
      tableName: 'board_containers',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [{ unique: false, fields: ['board_id'] }],
    }
  );

  BoardContainer.associate = ({ Board, ContainerItem }) => {
    BoardContainer.belongsTo(Board, {
      foreignKey: 'board_id',
      as: 'board',
    });
    BoardContainer.hasMany(ContainerItem, {
      foreignKey: 'container_id',
      as: 'items',
    });
  };

  return BoardContainer;
};
