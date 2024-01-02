'use strict';
import ProjectPermissions from './project-permissions.js';

export default (sequelize, DataTypes) => {
  const Project = sequelize.define(
    'Project',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      key: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      imageId: {
        type: DataTypes.INTEGER,
        field: 'image_id',
      },
      status: {
        type: DataTypes.STRING,
      },
      visibility: {
        type: DataTypes.STRING,
        defaultValue: 'internal',
        validate: {
          isIn: [['PRIVATE', 'INTERNAL', 'PUBLIC']],
        },
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
      tableName: 'projects',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { unique: true, fields: ['key'] },
        { unique: true, fields: ['name'] },
      ],
    }
  );

  Project.associate = ({ ProjectTag, Users, ProjectPermissions }) => {
    Project.hasMany(ProjectTag, { foreignKey: 'project_id' });
    Project.belongsToMany(Users, {
      through: ProjectPermissions,
      foreignKey: 'project_id',
      otherKey: 'user_id',
      as: 'users',
    });
  };

  return Project;
};
