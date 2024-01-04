import { DataTypes } from 'sequelize';

export default (sequelize) => {
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
        underscored: true,
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
      descriptionRaw: {
        type: DataTypes.BLOB,
        field: 'description_raw',
      },
      priority: {
        type: DataTypes.INTEGER,
        field: 'priority',
        defaultValue: 3,
      },
      archived: {
        type: DataTypes.BOOLEAN,
        field: 'archived',
        defaultValue: false,
      },
      parentId: {
        type: DataTypes.INTEGER,
        field: 'parent_id',
      },
      vectorSearch: {
        type: DataTypes.TSVECTOR,
        field: 'vector_search',
      },
      customFields: {
        type: DataTypes.JSONB,
        field: 'custom_fields',
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
        { unique: false, fields: ['vector_search'], using: 'gin' },
      ],
    }
  );

  Issue.associate = ({ IssueComment, IssueBoard, IssueLinks, Issue, Project }) => {
    Issue.belongsTo(Project, { foreignKey: 'project_id' });
    Issue.hasMany(IssueComment, { foreignKey: 'issue_id', onDelete: 'CASCADE' });
    Issue.hasMany(IssueBoard, { foreignKey: 'issue_id', onDelete: 'CASCADE' });
    Issue.belongsToMany(Issue, {
      through: IssueLinks,
      foreignKey: 'issue_id',
      otherKey: 'linked_issue_id',
      as: 'linkedToIssues',
    });
    Issue.belongsToMany(Issue, {
      through: IssueLinks,
      foreignKey: 'linked_issue_id',
      otherKey: 'issue_id',
      as: 'linkedByIssues',
    });
  };

  return Issue;
};
