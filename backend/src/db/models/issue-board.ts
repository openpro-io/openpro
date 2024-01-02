'use strict';
// TODO: Migration
export default (sequelize, DataTypes) => {
  const IssueBoards = sequelize.define(
    'IssueBoards',
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

  IssueBoards.associate = ({ Board, Issue }) => {
    IssueBoards.belongsTo(Board, { foreignKey: 'board_id' });
    IssueBoards.belongsTo(Issue, { foreignKey: 'issue_id' });
  };

  return IssueBoards;
};
