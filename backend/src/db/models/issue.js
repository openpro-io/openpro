'use strict';

export default (sequelize, DataTypes) => {
  const Issue = sequelize.define(
    'Issue',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      projectId: {
        type: DataTypes.INTEGER,
        field: 'project_id',
        references: {
          model: 'projects',
          key: 'id',
        },
      },
      issueStatusId: {
        type: DataTypes.INTEGER,
        field: 'issue_status_id',
        references: {
          model: 'issue_statuses',
          key: 'id',
        },
      },
      reporterId: {
        type: DataTypes.INTEGER,
        field: 'reporter_id',
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      assigneeId: {
        type: DataTypes.INTEGER,
        field: 'assignee_id',
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      title: {
        type: DataTypes.STRING,
        field: 'title',
      },
      description: {
        type: DataTypes.TEXT,
        field: 'description',
      },
      priority: {
        type: DataTypes.INTEGER,
        field: 'priority',
        defaultValue: 3,
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
      tableName: 'issues',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { unique: false, fields: ['project_id'] },
        { unique: false, fields: ['assignee_id'] },
        { unique: false, fields: ['reporter_id'] },
        { unique: false, fields: ['issue_status_id'] },
      ],
    }
  );

  Issue.associate = ({ IssueComment, IssueBoard }) => {
    Issue.hasMany(IssueComment, { foreignKey: 'issue_id', onDelete: 'CASCADE' });
    Issue.hasMany(IssueBoard, { foreignKey: 'issue_id', onDelete: 'CASCADE' });
  };

  return Issue;
};
