import { DataTypes, Sequelize } from 'sequelize';

import { ProjectTag } from './types.js';

export default (sequelize: Sequelize) => {
  ProjectTag.init(
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
        defaultValue: new Date(),
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
    ProjectTag.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
  };

  return ProjectTag;
};
