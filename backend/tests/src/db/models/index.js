import chai from 'chai';
import { DataTypes, Sequelize } from 'sequelize';
import {
  checkModelName,
  checkPropertyExists,
  checkUniqueIndex,
  dataTypes,
  makeMockModels,
  sequelize,
} from 'sequelize-test-helpers';
import sinonChai from 'sinon-chai';

import Asset from '../../../../src/db/models/asset.js';
import Board from '../../../../src/db/models/board.js';
import IssueCommentModel from '../../../../src/db/models/issue-comment.js';
import IssueComment from '../../../../src/db/models/issue-comment.js';
import IssueStatuses from '../../../../src/db/models/issue-statuses.js';
import IssueModel from '../../../../src/db/models/issue.js';
import Issue from '../../../../src/db/models/issue.js';
import ProjectTags from '../../../../src/db/models/project-tag.js';
import Project from '../../../../src/db/models/project.js';
import User from '../../../../src/db/models/user.js';

chai.use(sinonChai);

const expect = chai.expect;

const init = async () => {
  const db = {};

  db.sequelize = new Sequelize('postgres://postgres:postgres@localhost:5433/testing');

  db.User = User(db.sequelize, DataTypes);
  db.Project = Project(db.sequelize, DataTypes);
  db.Board = Board(db.sequelize, DataTypes);
  db.IssueStatuses = IssueStatuses(db.sequelize, DataTypes);
  db.Issue = Issue(db.sequelize, DataTypes);
  db.Asset = Asset(db.sequelize, DataTypes);
  db.IssueComment = IssueComment(db.sequelize, DataTypes);
  db.ProjectTags = ProjectTags(db.sequelize, DataTypes);

  Object.values(db).forEach((model) => {
    if (model.associate) {
      model.associate(db);
    }
  });

  await db.sequelize.sync({ force: true });

  return db;
};

describe('src/models/issue-comment', () => {
  const Issue = IssueModel(sequelize, dataTypes);
  const IssueComment = IssueCommentModel(sequelize, dataTypes);
  const issue = new Issue();

  checkModelName(Issue)('Issue');

  context('properties', () => {
    [
      'id',
      'projectId',
      'issueStatusId',
      'reporterId',
      'assigneeId',
      'title',
      'description',
      'createdAt',
      'updatedAt',
    ].forEach(checkPropertyExists(issue));
  });

  context('associations', () => {
    before(() => {
      Issue.associate({ IssueComment });
    });

    it('defined a hasMany association with issue', () => {
      expect(Issue.hasMany).to.have.been.calledWith(IssueComment);
    });
  });
});

describe('src/models/issue relations', () => {
  let db = {};

  before(async () => {
    db = await init();
  });

  context('IssueComment', () => {
    it('defined a hasMany association with issue', async () => {
      const projectId = 1;
      const issueStatusId = 2;
      const reporterId = 3;
      const assigneeId = 4;
      const issueId = 5;
      const issueCommentId = 6;

      const projectData = {
        id: projectId,
        name: 'test',
        key: 'test',
        description: 'test',
        boardName: 'test',
        boardStyle: 'test',
      };

      const assigneeUserData = {
        id: assigneeId,
        username: 'test',
        email: 'test@test.com',
      };

      const reporterUserData = {
        id: reporterId,
        username: 'test',
        email: 'test2@test.com',
      };

      const issueData = {
        id: issueId,
        title: 'test',
        description: 'test',
        projectId,
        issueStatusId,
        reporterId,
        assigneeId,
      };

      const issueCommentData = {
        id: issueCommentId,
        reporterId,
        issueId,
        comment: 'test',
      };

      const newAssigneeUser = await db.User.create(assigneeUserData);
      const newReporterUser = await db.User.create(reporterUserData);
      const newProject = await db.Project.create(projectData);
      const newIssueStatuses = await db.IssueStatuses.bulkCreate([
        {
          projectId: Number(projectId),
          name: 'Backlog',
        },
        {
          projectId: Number(projectId),
          name: 'In Progress',
        },
        {
          projectId: Number(projectId),
          name: 'Done',
        },
      ]);
      const newIssue = await db.Issue.create(issueData);
      const newIssueComment = await db.IssueComment.create(issueCommentData);
      const issueComments = await newIssue.getIssueComments();

      expect(newIssue.toJSON()).to.deep.include({ id: issueId, reporterId, assigneeId });
      expect(newIssueComment.toJSON()).to.deep.include({ id: issueCommentId, reporterId, issueId });
      expect(issueComments).to.be.an('array');
      expect(issueComments).to.have.lengthOf(1);
      expect(issueComments[0].toJSON()).to.deep.include({ id: issueCommentId, reporterId, issueId });

      // We test the cascade delete at this point
      await newIssue.destroy();

      const findIssueAfterDestroy = await db.Issue.findOne({ where: { id: issueId } });
      const findIssueCommentAfterDestroy = await db.IssueComment.findOne({
        where: { id: issueCommentId },
      });

      expect(findIssueAfterDestroy).to.be.null;
      expect(findIssueCommentAfterDestroy).to.be.null;
    });
  });
});

// TODO: Add tests for the rest of the models
// describe('src/models/Tags relations', () => {
//   let db = {};
//
//   before(async () => {
//     db = await init();
//   });
//
//   context('issue-comment', () => {
//     it('defined a hasMany association with issue', async () => {
//       const projectId = 1;
//       const issueStatusId = 2;
//       const reporterId = 3;
//       const assigneeId = 4;
//       const issueId = 5;
//       const issueCommentId = 6;
//
//       const projectData = {
//         id: projectId,
//         name: 'test',
//         key: 'test',
//         description: 'test',
//         boardName: 'test',
//         boardStyle: 'test',
//       };
//
//       const assigneeUserData = {
//         id: assigneeId,
//         username: 'test',
//         email: 'test@test.com',
//       };
//
//       const reporterUserData = {
//         id: reporterId,
//         username: 'test',
//         email: 'test2@test.com',
//       };
//
//       const issueData = {
//         id: issueId,
//         title: 'test',
//         description: 'test',
//         projectId,
//         issueStatusId,
//         reporterId,
//         assigneeId,
//       };
//
//       const issueCommentData = {
//         id: issueCommentId,
//         reporterId,
//         issueId,
//         comment: 'test',
//       };
//
//       const newAssigneeUser = await db.user.create(assigneeUserData);
//       const newReporterUser = await db.user.create(reporterUserData);
//       const newProject = await db.project.create(projectData);
//       const newIssueStatuses = await db.IssueStatuses.bulkCreate([
//         {
//           projectId: Number(projectId),
//           name: 'Backlog',
//         },
//         {
//           projectId: Number(projectId),
//           name: 'In Progress',
//         },
//         {
//           projectId: Number(projectId),
//           name: 'Done',
//         },
//       ]);
//       const newIssue = await db.issue.create(issueData);
//       const newIssueComment = await db.issue-comment.create(issueCommentData);
//       const issueComments = await newIssue.getIssueComments();
//
//       expect(newIssue.toJSON()).to.deep.include({ id: issueId, reporterId, assigneeId });
//       expect(newIssueComment.toJSON()).to.deep.include({ id: issueCommentId, reporterId, issueId });
//       expect(issueComments).to.be.an('array');
//       expect(issueComments).to.have.lengthOf(1);
//       expect(issueComments[0].toJSON()).to.deep.include({ id: issueCommentId, reporterId, issueId });
//
//       // We test the cascade delete at this point
//       await newIssue.destroy();
//
//       const findIssueAfterDestroy = await db.issue.findOne({ where: { id: issueId } });
//       const findIssueCommentAfterDestroy = await db.issue-comment.findOne({
//         where: { id: issueCommentId },
//       });
//
//       expect(findIssueAfterDestroy).to.be.null;
//       expect(findIssueCommentAfterDestroy).to.be.null;
//     });
//   });
// });
