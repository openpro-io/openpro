import { DataTypes, Sequelize } from 'sequelize';

import { IssueStatus } from './types.js';

export default (sequelize: Sequelize) =>
  IssueStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      projectId: {
        type: DataTypes.INTEGER,
        field: 'project_id',
        references: {
          model: 'projects',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING,
        field: 'name',
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
      tableName: 'issue_statuses',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { unique: false, fields: ['project_id'] },
        { unique: true, fields: ['project_id', 'name'] },
      ],
    }
  );
