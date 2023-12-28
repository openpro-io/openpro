import { Op } from 'sequelize';

const resolvers = {
  Query: {
    issues: (parent, { input: { projectId, id, search, searchOperator } }, { db }) => {
      let whereOr = [];
      let queryOperator = Op.or;

      if (projectId) whereOr = [...whereOr, { projectId: Number(projectId) }];
      if (id) whereOr = [...whereOr, { id: Number(id) }];
      if (search) {
        whereOr = [
          ...whereOr,
          {
            [Op.or]: {
              vectorSearch: {
                [Op.match]: db.Sequelize.fn('to_tsquery', search),
              },
              id: {
                [Op.eq]: search.replace(/[^0-9]/g, '') || null,
              },
            },
          },
        ];
      }
      if (searchOperator === 'and') queryOperator = Op.and;
      if (searchOperator === 'or') queryOperator = Op.or;

      return db.sequelize.models.Issue.findAll({
        include: [
          {
            model: db.sequelize.models.Project,
          },
          {
            model: db.sequelize.models.Issue,
            as: 'linkedToIssues',
            through: {
              attributes: [
                ['issue_id', 'issueId'],
                ['linked_issue_id', 'linkedIssueId'],
                ['link_type', 'linkType'],
              ],
            },
          },
          {
            model: db.sequelize.models.Issue,
            as: 'linkedByIssues',
            through: {
              attributes: [
                ['issue_id', 'issueId'],
                ['linked_issue_id', 'linkedIssueId'],
                ['link_type', 'linkType'],
              ],
            },
          },
        ],
        where: {
          [queryOperator]: whereOr,
        },
      });
    },
    issue: (parent, { input: { id } }, { db }) => {
      return db.sequelize.models.Issue.findByPk(id, {
        include: [
          {
            model: db.sequelize.models.Issue,
            as: 'linkedToIssues',
            through: {
              attributes: [
                ['issue_id', 'issueId'],
                ['linked_issue_id', 'linkedIssueId'],
                ['link_type', 'linkType'],
              ],
            },
          },
          {
            model: db.sequelize.models.Issue,
            as: 'linkedByIssues',
            through: {
              attributes: [
                ['issue_id', 'issueId'],
                ['linked_issue_id', 'linkedIssueId'],
                ['link_type', 'linkType'],
              ],
            },
          },
        ],
      });
    },
  },
  Mutation: {
    createIssueComment: async (parent, { input }, { db, user }) => {
      const { issueId, comment } = input;
      const reporterId = user.id;

      return await db.sequelize.models.IssueComment.create({
        issueId,
        reporterId,
        comment,
      });
    },
    deleteIssueLink: async (parent, { input: { issueId, linkType, linkedIssueId } }, { db }) => {
      await db.sequelize.models.IssueLinks.destroy({
        where: {
          issueId,
          linkType,
          linkedIssueId,
        },
      });

      return { message: 'success', status: 'success' };
    },
    createIssueLink: async (parent, { input: { issueId, linkType, linkedIssueId } }, { db }) => {
      const issue = await db.sequelize.models.Issue.findByPk(issueId);
      const linkedIssue = await db.sequelize.models.Issue.findByPk(linkedIssueId);

      if (!issue || !linkedIssue) {
        throw new Error('Issue not found');
      }

      await db.sequelize.models.IssueLinks.create({
        issueId,
        linkType,
        linkedIssueId,
      });

      return { message: 'success', status: 'success' };
    },
    updateIssue: async (parent, { input }, { db, io }) => {
      const { id, issueStatusId, assigneeId, reporterId, title, description, tagIds, priority, archived } = input;

      const issue = await db.sequelize.models.Issue.findByPk(id);

      if (issueStatusId) issue.issueStatusId = issueStatusId;
      if (assigneeId) issue.assigneeId = Number(assigneeId);
      if (reporterId) issue.reporterId = Number(reporterId);
      if (title) issue.title = title;
      if (description) issue.description = description;
      if (priority) issue.priority = Number(priority);
      if (tagIds) {
        await db.sequelize.models.IssueTag.destroy({ where: { issueId: id } });
        await db.sequelize.models.IssueTag.bulkCreate(
          tagIds.map((tagId) => ({
            issueId: Number(id),
            projectTagId: Number(tagId),
          }))
        );
      }
      if (archived !== undefined) issue.archived = archived;

      // TODO: look for better way to handle nullifying user
      if (issue.assigneeId === 0) issue.assigneeId = null;
      if (issue.reporterId === 0) issue.reporterId = null;

      await issue.save();

      // TODO: fix
      // emitIssueUpdatedEvent(io, issue.toJSON());

      const issueStatus = await db.sequelize.models.IssueStatuses.findByPk(issueStatusId ?? issue.issueStatusId);

      return { ...issue.toJSON(), status: issueStatus.toJSON() };
    },
    createIssue: async (parent, { input }, { db, user }) => {
      const { projectId, boardId, issueStatusId, assigneeId, title, description, priority } = input;

      // TODO: create issue status as unassigned option

      const issue = await db.sequelize.models.Issue.create({
        projectId,
        issueStatusId,
        assigneeId,
        reporterId: user.id,
        title,
        description,
        priority,
      });

      if (typeof boardId !== 'undefined') {
        await db.sequelize.models.IssueBoard.create({
          boardId,
          issueId: issue.id,
        });
      }

      const issueStatus = await db.sequelize.models.IssueStatuses.findByPk(issueStatusId);

      return { ...issue.toJSON(), status: issueStatus.toJSON() };
    },
    deleteIssue: async (parent, { input }, { db }) => {
      const { id } = input;

      await db.sequelize.transaction(async (t) => {
        await db.sequelize.models.Issue.destroy({
          where: {
            id,
          },
          transaction: t,
        });

        // TODO: not needed due to cascade
        await db.sequelize.models.IssueComment.destroy({ where: { issueId: id }, transaction: t });
      });

      return { message: 'issue deleted', status: 'success' };
    },
  },
  Issue: {
    links: async (parent, args, { db }) => {
      return [
        ...parent.linkedToIssues?.map((issue) => ({
          ...issue.toJSON(),
          linkType: issue.IssueLinks.linkType,
          linkedIssueId: parent.id,
        })),
        ...parent.linkedByIssues?.map((issue) => ({
          ...issue.toJSON(),
          linkType: issue.IssueLinks.linkTypeInverted,
          linkedIssueId: parent.id,
        })),
      ];
    },
    tags: async (parent, args, { db }) => {
      const issueTags = await db.sequelize.models.IssueTag.findAll({ where: { issueId: parent.id } });

      return await db.sequelize.models.ProjectTag.findAll({
        where: { id: issueTags.map((issueTag) => issueTag.projectTagId) },
      });
    },
    comments: (parent, args, { db }) => {
      return db.sequelize.models.IssueComment.findAll(
        { where: { issueId: parent.id } },
        { order: [['createdAt', 'DESC']] }
      );
    },
    status: (parent, args, { db }) => {
      return db.sequelize.models.IssueStatuses.findByPk(parent.issueStatusId);
    },
    reporter: (parent, args, { db }) => {
      return db.sequelize.models.User.findByPk(parent.reporterId);
    },
    assignee: (parent, args, { db }) => {
      return db.sequelize.models.User.findByPk(parent.assigneeId);
    },
    project: (parent) => parent.Project,
  },
};

export default resolvers;
