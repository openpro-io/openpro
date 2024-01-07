'use strict';

import { DataTypes, Sequelize } from 'sequelize';

import { IssueTag } from './types.js';

export default (sequelize: Sequelize) => {
  IssueTag.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      projectTagId: {
        type: DataTypes.INTEGER,
        field: 'project_tag_id',
        references: {
          model: 'project_tags',
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
      tableName: 'issue_tags',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { unique: false, fields: ['project_tag_id'] },
        { unique: false, fields: ['issue_id'] },
        { unique: true, fields: ['project_tag_id', 'issue_id'] },
      ],
    }
  );

  IssueTag.associate = ({ Issue }) => {
    IssueTag.belongsTo(Issue, { foreignKey: 'issue_id', as: 'issue' });
  };

  return IssueTag;
};
