import { DataTypes, Sequelize } from 'sequelize';

import { Board } from './types.js';

export default (sequelize: Sequelize) => {
  Board.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      projectId: {
        type: DataTypes.INTEGER,
        field: 'project_id',
      },
      name: {
        type: DataTypes.STRING,
        field: 'name',
      },
      style: {
        type: DataTypes.STRING,
        field: 'style',
      },
      viewState: {
        type: DataTypes.JSONB,
        field: 'view_state',
      },
      status: DataTypes.STRING,
      backlogEnabled: {
        type: DataTypes.BOOLEAN,
        field: 'backlog_enabled',
        defaultValue: false,
      },
      settings: {
        type: DataTypes.JSONB,
        field: 'settings',
      },
      containerOrder: {
        type: DataTypes.JSONB,
        field: 'container_order',
      },
      version: {
        type: DataTypes.INTEGER,
        field: 'version',
        allowNull: false,
        defaultValue: 1,
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
      tableName: 'boards',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [{ unique: true, fields: ['project_id'] }],
    }
  );

  Board.associate = ({ IssueBoard, Project, Issue, BoardContainer }) => {
    Board.belongsToMany(Issue, {
      through: IssueBoard,
      foreignKey: 'board_id',
      otherKey: 'issue_id',
      as: 'issues',
    });
    Board.belongsTo(Project, {
      foreignKey: 'project_id',
      as: 'project',
    });
    Board.hasMany(BoardContainer, {
      foreignKey: 'board_id',
      as: 'containers',
    });
  };

  return Board;
};
