// TODO: Migration
import { DataTypes, Sequelize } from 'sequelize';

import { IssueBoard } from './types.js';

export default (sequelize: Sequelize) => {
  IssueBoard.init(
    {
      boardId: {
        type: DataTypes.INTEGER,
        field: 'board_id',
      },
      issueId: {
        type: DataTypes.INTEGER,
        field: 'issue_id',
      },
      position: {
        type: DataTypes.INTEGER,
        field: 'position',
      },
    },
    {
      sequelize,
      tableName: 'issue_boards',
      timestamps: false,
      indexes: [
        { unique: false, fields: ['board_id'] },
        { unique: true, fields: ['issue_id', 'board_id'] },
      ],
    }
  );

  IssueBoard.associate = ({ Board, Issue }) => {
    IssueBoard.belongsTo(Board, { foreignKey: 'board_id', as: 'board' });
    IssueBoard.belongsTo(Issue, { foreignKey: 'issue_id', as: 'issue' });
  };

  return IssueBoard;
};
