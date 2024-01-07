'use strict';

import { Sequelize } from 'sequelize';

import { ENABLE_SEQUELIZE_LOGGING, SQL_URI } from '../../services/config.js';
import type { Db } from '../../typings.js';
import Asset from './asset.js';
import Board from './board.js';
import IssueBoard from './issue-board.js';
import IssueComment from './issue-comment.js';
import IssueLink from './issue-link.js';
import IssueStatuses from './issue-statuses.js';
import IssueTag from './issue-tag.js';
import Issue from './issue.js';
import ProjectCustomFields from './project-custom-fields.js';
import ProjectPermissions from './project-permissions.js';
import ProjectTag from './project-tag.js';
import Project from './project.js';
import User from './user.js';

export const db: Db = {};

const init = async () => {
  db.sequelize = new Sequelize(SQL_URI, {
    logging: ENABLE_SEQUELIZE_LOGGING,
  });

  db.User = User(db.sequelize);
  db.Project = Project(db.sequelize);
  db.Board = Board(db.sequelize);
  db.IssueStatuses = IssueStatuses(db.sequelize);
  db.Issue = Issue(db.sequelize);
  db.Asset = Asset(db.sequelize);
  db.IssueComment = IssueComment(db.sequelize);
  db.ProjectTag = ProjectTag(db.sequelize);
  db.IssueTag = IssueTag(db.sequelize);
  db.IssueBoard = IssueBoard(db.sequelize);
  db.IssueLink = IssueLink(db.sequelize);
  db.ProjectPermissions = ProjectPermissions(db.sequelize);
  db.ProjectCustomFields = ProjectCustomFields(db.sequelize);

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
