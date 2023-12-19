'use strict';

export default (sequelize, DataTypes) => {
  const IssueLink = sequelize.define(
    'IssueLinks',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      issueId: {
        type: DataTypes.INTEGER,
        field: 'issue_id',
        references: {
          model: 'issues',
          key: 'id',
        },
      },
      linkType: {
        type: DataTypes.STRING,
        field: 'link_type',
        validate: {
          isIn: [['blocks', 'blocked_by', 'relates_to', 'duplicates', 'duplicated_by', 'clones', 'is_cloned_by']],
        },
      },
      linkedIssueId: {
        type: DataTypes.INTEGER,
        field: 'linked_issue_id',
        references: {
          model: 'issues',
          key: 'id',
        },
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        default: new Date(),
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: 'issues_links',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { unique: false, fields: ['link_type'] },
        { unique: false, fields: ['issue_id'] },
        { unique: false, fields: ['linked_issue_id'] },
      ],
    }
  );

  IssueLink.associate = ({ Issue }) => {
    IssueLink.belongsTo(Issue, { foreignKey: 'issue_id' });
    IssueLink.belongsTo(Issue, { foreignKey: 'linked_issue_id' });
  };

  return IssueLink;
};
