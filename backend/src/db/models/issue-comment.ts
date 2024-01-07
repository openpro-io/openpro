import { DataTypes, Sequelize } from 'sequelize';

import { IssueComment } from './types.js';

export default (sequelize: Sequelize) => {
  IssueComment.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      reporterId: {
        type: DataTypes.INTEGER,
        field: 'reporter_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      issueId: {
        type: DataTypes.INTEGER,
        field: 'issue_id',
        references: {
          model: 'issues',
          key: 'id',
        },
      },
      comment: {
        type: DataTypes.TEXT,
        field: 'comment',
      },
      commentRaw: {
        type: DataTypes.BLOB,
        field: 'comment_raw',
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: 'issue_comments',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { unique: false, fields: ['reporter_id'] },
        { unique: false, fields: ['issue_id'] },
      ],
    }
  );

  IssueComment.associate = ({ Issue }) => {
    IssueComment.belongsTo(Issue, { foreignKey: 'issue_id', as: 'issue' });
  };

  return IssueComment;
};
