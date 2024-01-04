import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Board = sequelize.define(
    'Board',
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

  Board.associate = ({ IssueBoard, Issue }) => {
    Board.belongsToMany(Issue, {
      through: IssueBoard,
      foreignKey: 'board_id',
      otherKey: 'issue_id',
    });
  };

  return Board;
};
