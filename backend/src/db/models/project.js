'use strict';
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

  Project.associate = ({ ProjectTag }) => {
    Project.hasMany(ProjectTag);
  };

  return Project;
};
