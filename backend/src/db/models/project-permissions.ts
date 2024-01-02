'use strict';

export default (sequelize, DataTypes) => {
  const ProjectPermission = sequelize.define(
    'ProjectPermission',
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
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'project_permissions',
      timestamps: false,
      indexes: [{ unique: true, fields: ['project_id', 'user_id'] }],
    }
  );

  return ProjectPermission;
};
