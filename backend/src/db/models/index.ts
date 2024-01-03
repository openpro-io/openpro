'use strict';

import { DataTypes, Sequelize } from 'sequelize';

import { ENABLE_SEQUELIZE_LOGGING, SQL_URI } from '../../services/config.js';
import type { Db } from '../../typings.js';
import Asset from './asset.js';
import Board from './board.js';
import IssueBoard from './issue-board.js';
import IssueComment from './issue-comment.js';
import IssueLinks from './issue-links.js';
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
