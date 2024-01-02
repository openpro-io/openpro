import Sequelize from 'sequelize/types/sequelize';

export type Model = {
  associate?: (db: Db) => void;
};

export type Db = {
  sequelize?: Sequelize;
  Sequelize?: typeof Sequelize;
  Users?: Model;
  Project?: Model;
  Board?: Model;
  IssueStatuses?: Model;
  Issue?: Model;
  Asset?: Model;
  IssueComment?: Model;
  ProjectTag?: Model;
  IssueTag?: Model;
  IssueBoard?: Model;
  IssueLinks?: Model;
  ProjectPermissions?: Model;
  ProjectCustomFields?: Model;
  init?: () => Promise<void>;
};
