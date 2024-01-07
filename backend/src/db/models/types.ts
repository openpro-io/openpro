// https://sequelize.org/docs/v6/other-topics/typescript/
import {
  Association,
  BelongsToGetAssociationMixin,
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

import { Db } from '../../typings.js';

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

export class ProjectTag extends Model<
  InferAttributes<ProjectTag, { omit: 'project' }>,
  InferCreationAttributes<ProjectTag, { omit: 'project' }>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare projectId: ForeignKey<Project['id']>;
  declare name: CreationOptional<string>;

  declare getProject: BelongsToGetAssociationMixin<Project>;

  declare project?: NonAttribute<Project>;

  declare static associate: Associate;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class ProjectCustomField extends Model<
  InferAttributes<ProjectCustomField, { omit: 'project' }>,
  InferCreationAttributes<ProjectCustomField, { omit: 'project' }>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare projectId: ForeignKey<Project['id']>;
  declare fieldName: string;
  declare fieldType: string;

  declare getProject: BelongsToGetAssociationMixin<Project>;

  declare project?: NonAttribute<Project>;

  declare static associate: Associate;

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

  declare static associate: Associate;
}

export class Project extends Model<
  InferAttributes<Project, { omit: 'projectTags' | 'users' }>,
  InferCreationAttributes<Project, { omit: 'projectTags' | 'users' }>
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

  declare getUsers: BelongsToManyGetAssociationsMixin<User>;

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

export class IssueStatus extends Model<InferAttributes<IssueStatus>, InferCreationAttributes<IssueStatus>> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare projectId: ForeignKey<Project['id']>;
  declare name: string;

  declare static associate?: Associate;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class IssueComment extends Model<
  InferAttributes<IssueComment, { omit: 'issue' }>,
  InferCreationAttributes<IssueComment, { omit: 'issue' }>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare reporterId: ForeignKey<User['id']>;
  declare issueId: ForeignKey<Issue['id']>;
  declare comment: string;
  declare commentRaw: CreationOptional<string>;

  declare getIssue: BelongsToGetAssociationMixin<Issue>;

  declare static associate: Associate;

  declare issue?: NonAttribute<Issue>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    issue: Association<IssueComment, Issue>;
  };

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class IssueTag extends Model<
  InferAttributes<IssueTag, { omit: 'issue' }>,
  InferCreationAttributes<IssueTag, { omit: 'issue' }>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare projectTagId: ForeignKey<ProjectTag['id']>;
  declare issueId: ForeignKey<Issue['id']>;

  declare getIssue: BelongsToGetAssociationMixin<Issue>;

  declare static associate: Associate;

  declare issue?: NonAttribute<Issue>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    issue: Association<IssueTag, Issue>;
  };

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class Board extends Model<
  InferAttributes<Board, { omit: 'issues' }>,
  InferCreationAttributes<Board, { omit: 'issues' }>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare projectId: ForeignKey<Project['id']>;
  declare name: CreationOptional<string>;
  declare style: CreationOptional<string>;
  declare viewState: CreationOptional<object>;
  declare status: CreationOptional<string>;
  declare backlogEnabled: CreationOptional<boolean>;
  declare settings: CreationOptional<object>;
  declare containerOrder: CreationOptional<object>;

  declare getIssues: BelongsToManyGetAssociationsMixin<Issue[]>;

  declare static associate: Associate;

  declare issues?: NonAttribute<Issue[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    issue: Association<Board, Issue>;
  };

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class IssueLink extends Model<InferAttributes<IssueLink>, InferCreationAttributes<IssueLink>> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare issueId: ForeignKey<Issue['id']>;
  declare linkType: string;
  declare linkTypeInverted: string;
  declare linkedIssueId: ForeignKey<Issue['id']>;
  // TODO: Lets double check this is correct
  declare static inverseLinkType: {
    duplicates: string;
    clones: string;
    blocks: string;
    blocked_by: string;
    duplicated_by: string;
    relates_to: string;
    is_cloned_by: string;
  };

  declare static associate?: Associate;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class IssueBoard extends Model<
  InferAttributes<IssueBoard, { omit: 'issue' | 'board' }>,
  InferCreationAttributes<IssueBoard, { omit: 'issue' | 'board' }>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare boardId: ForeignKey<Board['id']>;
  declare issueId: ForeignKey<Issue['id']>;
  declare position: CreationOptional<number>;

  declare getIssue: BelongsToGetAssociationMixin<Issue>;
  declare getBoard: BelongsToGetAssociationMixin<Board>;

  declare static associate: Associate;

  declare issue?: NonAttribute<Issue>; // Note this is optional since it's only populated when explicitly requested in code
  declare board?: NonAttribute<Board>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    issue: Association<IssueComment, Issue>;
    board: Association<IssueComment, Board>;
  };
}

export class Issue extends Model<
  InferAttributes<Issue, { omit: 'project' }>,
  InferCreationAttributes<Issue, { omit: 'project' }>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare projectId: ForeignKey<Project['id']>;
  declare issueStatusId: ForeignKey<IssueStatus['id']>;
  declare assigneeId: ForeignKey<User['id']>;
  declare reporterId: ForeignKey<User['id']>;
  declare title: CreationOptional<string>;
  declare description?: CreationOptional<string>;
  declare descriptionRaw?: CreationOptional<string>;
  declare priority: CreationOptional<number>;
  declare archived: CreationOptional<boolean>;
  declare parentId?: CreationOptional<number>;
  declare vectorSearch?: CreationOptional<unknown>;
  declare customFields?: CreationOptional<object>; // ??

  declare getProject: BelongsToGetAssociationMixin<Project>;
  declare getIssueStatus: BelongsToGetAssociationMixin<IssueStatus>; // TODO: Write this association
  declare getAssignee: BelongsToGetAssociationMixin<User>;
  declare getReporter: BelongsToGetAssociationMixin<User>;
  declare getIssueComments: HasManyGetAssociationsMixin<IssueComment[]>;
  declare getIssueBoards: HasManyGetAssociationsMixin<IssueBoard[]>;
  declare getLinkedToIssues: BelongsToManyGetAssociationsMixin<IssueLink[]>;
  declare getLinkedByIssues: BelongsToManyGetAssociationsMixin<IssueLink[]>;

  declare static associate: Associate;

  // TODO: Add the other relationships

  declare project?: NonAttribute<Project>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    project: Association<Issue, Project>;
  };

  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

export class Asset extends Model<InferAttributes<Asset>, InferCreationAttributes<Asset>> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare ownerId: ForeignKey<User['id']>;
  declare assetType: string;
  declare assetSubType: string;
  declare assetPath: string;
  declare assetProvider: string;
  declare assetFilename: string;

  // TODO: Define associations

  declare static associate?: Associate;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
