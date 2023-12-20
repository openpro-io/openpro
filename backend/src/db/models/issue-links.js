'use strict';

export default (sequelize, DataTypes) => {
  const inverseLinkType = {
    blocks: 'blocked_by',
    blocked_by: 'blocks',
    duplicates: 'duplicated_by',
    duplicated_by: 'duplicates',
    relates_to: 'relates_to',
    clones: 'is_cloned_by',
    is_cloned_by: 'clones',
  };

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
          isIn: [Object.keys(inverseLinkType)],
        },
      },
      linkTypeInverted: {
        type: DataTypes.STRING,
        get() {
          return inverseLinkType?.[this.getDataValue('linkType')];
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

  IssueLink.inverseLinkType = inverseLinkType;

  return IssueLink;
};
