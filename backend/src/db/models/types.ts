// https://sequelize.org/docs/v6/other-topics/typescript/
import {
  Association,
  BelongsToManyGetAssociationsMixin,
  CreationOptional,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';

import { Db } from '../../typings';

type Associate = (db: Db) => void;

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare externalId: string;
  declare firstName: CreationOptional<string | null>;
  declare lastName: CreationOptional<string | null>;
  declare email: CreationOptional<string | null>;
  declare avatarAssetId: CreationOptional<number | null>;

  declare static associate?: Associate;

  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

export class ProjectTag extends Model<InferAttributes<ProjectTag>, InferCreationAttributes<ProjectTag>> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare projectId: ForeignKey<Project['id']>;
  declare name: string;

  declare static associate?: Associate;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class ProjectPermission extends Model<
  InferAttributes<ProjectPermission>,
  InferCreationAttributes<ProjectPermission>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare projectId: ForeignKey<Project['id']>;
  declare userId: ForeignKey<User['id']>;

  declare static associate?: Associate;
}

export class Project extends Model<
  InferAttributes<Project, { omit: 'projectTags' }>,
  InferCreationAttributes<Project, { omit: 'projectTags' }>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare name: string;
  declare key: CreationOptional<string | null>;
  declare description: CreationOptional<string | null>;
  declare imageId: CreationOptional<number | null>;
  declare status: CreationOptional<string | null>;
  declare visibility: CreationOptional<string | null>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getProjectTags: HasManyGetAssociationsMixin<ProjectTag>; // Note the null assertions!
  declare addProjectTag: HasManyAddAssociationMixin<ProjectTag, number>;
  declare addProjectTags: HasManyAddAssociationsMixin<ProjectTag, number>;
  declare setProjectTags: HasManySetAssociationsMixin<ProjectTag, number>;
  declare removeProjectTag: HasManyRemoveAssociationMixin<ProjectTag, number>;
  declare removeProjectTags: HasManyRemoveAssociationsMixin<ProjectTag, number>;
  declare hasProjectTag: HasManyHasAssociationMixin<ProjectTag, number>;
  declare hasProjectTags: HasManyHasAssociationsMixin<ProjectTag, number>;
  declare countProjectTags: HasManyCountAssociationsMixin;
  declare createProjectTag: HasManyCreateAssociationMixin<ProjectTag, 'projectId'>;

  declare getProjectUsers: BelongsToManyGetAssociationsMixin<User>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare projectTags?: NonAttribute<ProjectTag[]>; // Note this is optional since it's only populated when explicitly requested in code
  declare users?: NonAttribute<User[]>;

  declare static associations: {
    projectTags: Association<Project, ProjectTag>;
    users: Association<Project, User>;
  };

  declare static associate?: Associate;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

