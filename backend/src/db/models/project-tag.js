'use strict';

export default (sequelize, DataTypes) => {
  const ProjectTag = sequelize.define(
    'ProjectTag',
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
      },
      name: {
        type: DataTypes.STRING,
        field: 'name',
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
      tableName: 'project_tags',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { unique: false, fields: ['project_id'] },
        { unique: false, fields: ['name'] },
        { unique: true, fields: ['project_id', 'name'] },
      ],
    }
  );

  ProjectTag.associate = ({ Project }) => {
    ProjectTag.belongsTo(Project, { foreignKey: 'project_id' });
  };

  return ProjectTag;
};
