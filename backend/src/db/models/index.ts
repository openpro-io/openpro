'use strict';

import { DataTypes, Sequelize } from 'sequelize';

import { ENABLE_SEQUELIZE_LOGGING, SQL_URI } from '@/services/config';
import Asset from './asset';
import Board from './board';
import IssueBoard from './issue-board';
import IssueComment from './issue-comment';
import IssueLinks from './issue-links';
import IssueStatuses from './issue-statuses';
import IssueTag from './issue-tag';
import Issue from './issue';
import ProjectCustomFields from './project-custom-fields';
import ProjectPermissions from './project-permissions';
import ProjectTag from './project-tag';
import Project from './project';
import User from './user';
import { Db } from '@/typings/model';

export const db: Db = {};

const init = async () => {
  db.sequelize = new Sequelize(SQL_URI, {
    logging: ENABLE_SEQUELIZE_LOGGING,
  });

  db.Users = User(db.sequelize, DataTypes);
  db.Project = Project(db.sequelize, DataTypes);
  db.Board = Board(db.sequelize, DataTypes);
  db.IssueStatuses = IssueStatuses(db.sequelize, DataTypes);
  db.Issue = Issue(db.sequelize, DataTypes);
  db.Asset = Asset(db.sequelize, DataTypes);
  db.IssueComment = IssueComment(db.sequelize, DataTypes);
  db.ProjectTag = ProjectTag(db.sequelize, DataTypes);
  db.IssueTag = IssueTag(db.sequelize, DataTypes);
  db.IssueBoard = IssueBoard(db.sequelize, DataTypes);
  db.IssueLinks = IssueLinks(db.sequelize, DataTypes);
  db.ProjectPermissions = ProjectPermissions(db.sequelize, DataTypes);
  db.ProjectCustomFields = ProjectCustomFields(db.sequelize, DataTypes);

  Object.values(db).forEach((model: any) => {
    if (model.associate) {
      model.associate(db);
    }
  });

  // TODO: Run migration instead of sync
  // await db.sequelize.sync();
};

db.init = init;
db.Sequelize = Sequelize;
