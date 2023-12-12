'use strict';

import { DataTypes, Sequelize } from 'sequelize';
import { ENABLE_SEQUELIZE_LOGGING, SQL_URI } from '../../services/config.js';

import User from './user.js';
import Project from './project.js';
import Board from './board.js';
import IssueStatuses from './issue-statuses.js';
import Issue from './issue.js';
import Asset from './asset.js';
import IssueComment from './issue-comment.js';
import ProjectTag from './project-tag.js';
import IssueTag from './issue-tag.js';
import IssueBoard from './issue-board.js';

export const db = {};

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

  Object.values(db).forEach((model) => {
    if (model.associate) {
      model.associate(db);
    }
  });

  // TODO: Run migration instead of sync
  // await db.sequelize.sync();
};

db.init = init;
db.Sequelize = Sequelize;
