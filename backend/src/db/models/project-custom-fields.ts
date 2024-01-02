'use strict';

export default (sequelize, DataTypes) => {
  const ProjectCustomField = sequelize.define(
    'ProjectCustomField',
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
      fieldName: {
        type: DataTypes.STRING,
        field: 'field_name',
      },
      fieldType: {
        type: DataTypes.STRING,
        field: 'field_type',
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: 'project_custom_fields',
      timestamps: false,
      indexes: [{ unique: false, fields: ['project_id'] }],
    }
  );

  ProjectCustomField.associate = ({ Project }) => {
    ProjectCustomField.belongsTo(Project, { foreignKey: 'project_id' });
  };

  return ProjectCustomField;
};
