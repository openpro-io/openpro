import { DataTypes, Sequelize } from 'sequelize';

import { Project } from './types.js';

export default (sequelize: Sequelize) => {
  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
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

  Project.associate = ({ ProjectTag, User, ProjectPermission }) => {
    Project.hasMany(ProjectTag, { foreignKey: 'project_id', as: 'projectTags' });
    Project.belongsToMany(User, {
      through: ProjectPermission,
      foreignKey: 'project_id',
      otherKey: 'user_id',
      as: 'users',
    });
  };

  return Project;
};
