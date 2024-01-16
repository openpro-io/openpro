import { keyBy, merge, values } from 'lodash-es';
import { Op } from 'sequelize';
import yn from 'yn';

import {
  type CustomFieldValueResolvers,
  Custom_Field_Type,
  type IssueResolvers,
  type MutationResolvers,
  ProjectVisibility,
  type QueryResolvers,
  type Resolvers,
} from '../../__generated__/resolvers-types.js';
import { Issue as IssueModel } from '../../db/models/types.js';
import { websocketBroadcast } from '../../services/ws-server.js';
import { formatUserForGraphql } from '../user/helpers.js';

const Query: QueryResolvers = {
  issues: async (parent, { input: { projectId, id, search, searchOperator } }, { db, dataLoaderContext }) => {
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

    const issuesListPlain = await db.Issue.findAll({
      where: {
        [queryOperator]: whereOr,
      },
    });

    // dataLoaderContext.prime(issuesListPlain);

    return (
      issuesListPlain &&
      issuesListPlain.map((issue) => ({
        ...issue.toJSON(),
        id: `${issue.id}`,
        projectId: `${issue.projectId}`,
        project: undefined,
        customFields: undefined,
      }))
    );
  },
  issue: async (parent, { input: { id } }, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const databaseIssue = await db.Issue.findByPk(id, {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    return {
      ...databaseIssue.toJSON(),
      id: `${databaseIssue.id}`,
      projectId: `${databaseIssue.projectId}`,
      project: undefined,
      customFields: undefined,
    };
  },
};

const Mutation: MutationResolvers = {
  deleteIssueLink: async (parent, { input: { issueId, linkType, linkedIssueId } }, { db }) => {
    await db.IssueLink.destroy({
      where: {
        issueId,
        linkType,
        linkedIssueId,
      },
    });

    return { message: 'success', status: 'success' };
  },
  createIssueLink: async (parent, { input: { issueId, linkType, linkedIssueId } }, { db }) => {
    const issue = await db.Issue.findByPk(issueId);
    const linkedIssue = await db.Issue.findByPk(linkedIssueId);

    if (!issue || !linkedIssue) {
      throw new Error('Issue not found');
    }

    await db.IssueLink.create({
      issueId: issue.id,
      linkType,
      linkedIssueId: linkedIssue.id,
    });

    return { message: 'success', status: 'success' };
  },
  updateIssue: async (parent, { input }, { db, websocketServer, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const {
      id,
      issueStatusId,
      assigneeId,
      reporterId,
      title,
      description,
      tagIds,
      priority,
      archived,
      customFieldId,
      customFieldValue,
    } = input;

    return await db.sequelize.transaction(async (transaction) => {
      const issue = await db.Issue.findByPk(Number(id), {
        // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
        transaction,
      });

      if (issueStatusId) issue.issueStatusId = Number(issueStatusId);
      if (assigneeId) issue.assigneeId = Number(assigneeId);
      if (reporterId) issue.reporterId = Number(reporterId);
      if (title) issue.title = title;
      if (description) issue.description = description;
      if (priority) issue.priority = Number(priority);
      if (tagIds) {
        await db.IssueTag.destroy({ where: { issueId: id }, transaction });
        await db.IssueTag.bulkCreate(
          tagIds.map((tagId) => ({
            issueId: Number(id),
            projectTagId: Number(tagId),
          })),
          { transaction }
        );
      }
      if (archived !== undefined) issue.archived = archived;

      // TODO: look for better way to handle nullifying user
      if (issue.assigneeId === 0) issue.assigneeId = null;
      if (issue.reporterId === 0) issue.reporterId = null;

      if (customFieldId && customFieldValue) {
        const customField = await db.ProjectCustomField.findByPk(Number(customFieldId), {
          // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
          transaction,
        });
        if (!customField) throw new Error('Custom field not found');

        let valueCasted: number | string | boolean = customFieldValue;

        if (customField.fieldType.toLowerCase() === 'number') valueCasted = Number(customFieldValue);
        else if (customField.fieldType.toLowerCase() === 'boolean') valueCasted = yn(customFieldValue);

        const customFieldObject = {
          id: `${issue.id}-${customField.id}`,
          customFieldId,
          value: valueCasted,
          createdAt: new Date(), // TODO: improve date format decision
        };

        // TODO: investigate how to deep set the value instead of this to leverage DB level updating
        issue.customFields = issue.customFields
          ? values(merge(keyBy(issue.customFields, 'id'), keyBy([customFieldObject], 'id')))
          : [customFieldObject];
      }

      await issue.save({ transaction });
      // dataLoaderContext.prime(issue);

      const issueStatus = await db.IssueStatuses.findByPk(Number(issueStatusId ?? issue.issueStatusId), {
        [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
        transaction,
      });

      // START: This is specific to the issue board
      const board = await db.Board.findOne({
        where: { projectId: issue.projectId },
        transaction,
      });

      // This is the destination column on the board we want to move to
      const boardContainer = await db.BoardContainer.findOne({
        where: { boardId: board.id, title: issueStatus.name },
        transaction,
      });

      const issueOnBoard = await db.ContainerItem.findOne({
        where: { issueId: issue.id },
        transaction,
      });

      const maxPosition = Number(
        await db.ContainerItem.max('position', {
          where: { containerId: boardContainer.id },
          transaction,
        })
      );

      issueOnBoard.containerId = boardContainer.id;
      issueOnBoard.position = maxPosition > 0 ? maxPosition + 1 : 0;
      await issueOnBoard.save();
      // END: This is specific to the issue board

      const returnData = {
        ...issue.toJSON(),
        id: `${issue.id}`,
        projectId: `${issue.projectId}`,
        project: undefined,
        customFields: undefined,
        status: {
          ...issueStatus.toJSON(),
          id: `${issueStatus.id}`,
          projectId: `${issueStatus.projectId}`,
        },
      };

      websocketBroadcast({
        clients: websocketServer.clients,
        namespace: 'ws',
        message: JSON.stringify({ type: 'ISSUE_UPDATED', payload: returnData }),
      });

      return returnData;
    });
  },
  createIssue: async (parent, { input }, { db, user, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const { projectId, boardId, issueStatusId, assigneeId, title, description, priority } = input;

    // TODO: create issue status as unassigned option

    const issue = await db.Issue.create({
      projectId: Number(projectId),
      issueStatusId: Number(issueStatusId),
      assigneeId: assigneeId ? Number(assigneeId) : undefined,
      reporterId: user.id,
      title,
      description,
      priority,
    });

    // dataLoaderContext.prime(issue);

    // TODO: This isnt currently implemented in the UI
    if (typeof boardId !== 'undefined') {
      const issueBoard = await db.IssueBoard.create({
        boardId: Number(boardId),
        issueId: Number(issue.id),
      });

      // dataLoaderContext.prime(issueBoard);
    }

    const issueStatus = await db.IssueStatuses.findByPk(issueStatusId, {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    return {
      ...issue.toJSON(),
      id: `${issue.id}`,
      projectId: `${issue.projectId}`,
      project: undefined,
      customFields: undefined,
      status: {
        ...issueStatus.toJSON(),
        id: `${issueStatus.id}`,
        projectId: `${issueStatus.projectId}`,
      },
    };
  },
  deleteIssue: async (parent, { input }, { db }) => {
    const { id } = input;

    await db.sequelize.transaction(async (t) => {
      await db.Issue.destroy({
        where: {
          id,
        },
        transaction: t,
      });

      // TODO: not needed due to cascade
      await db.IssueComment.destroy({ where: { issueId: id }, transaction: t });
    });

    return { message: 'issue deleted', status: 'success' };
  },
};

const CustomFieldValue: CustomFieldValueResolvers = {
  customField: async (parent, args, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    if (!parent.customFieldId) return null;

    const customFieldData = await db.ProjectCustomField.findByPk(Number(parent.customFieldId), {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    return {
      ...customFieldData.toJSON(),
      id: `${customFieldData.id}`,
      projectId: `${customFieldData.projectId}`,
      fieldType: customFieldData.fieldType as Custom_Field_Type,
    };
  },
};

const Issue: IssueResolvers = {
  links: async (parent, args, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const databaseIssues = await db.Issue.findByPk(Number(parent.id), {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
      include: [
        {
          model: db.Issue,
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
          model: db.Issue,
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

    const issueToPlainObject = (issue: IssueModel) => ({
      ...issue.toJSON(),
      id: `${issue.id}`,
      projectId: `${issue.projectId}`,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      linkedIssueId: `${parent.id}`,
      customFields: undefined,
      project: undefined,
    });

    return [
      ...(databaseIssues.linkedByIssues?.map(issueToPlainObject) ?? []),
      ...(databaseIssues.linkedToIssues?.map(issueToPlainObject) ?? []),
    ];
  },
  tags: async (parent, args, { db, dataLoaderContext }) => {
    const issueTags = await db.IssueTag.findAll({ where: { issueId: parent.id } });
    // dataLoaderContext.prime(issueTags);

    const projectTags = await db.ProjectTag.findAll({
      where: { id: issueTags.map((issueTag) => issueTag.projectTagId) },
    });
    // dataLoaderContext.prime(projectTags);

    return projectTags.map((projectTag) => ({
      ...projectTag.toJSON(),
      projectId: `${projectTag.projectId}`,
      id: `${projectTag.id}`,
    }));
  },
  comments: async (parent, args, { db, dataLoaderContext }) => {
    const comments = await db.IssueComment.findAll({
      where: { issueId: Number(parent.id) },
      order: [['createdAt', 'DESC']],
    });
    // dataLoaderContext.prime(comments);

    return comments.map((comment) => ({
      ...comment.toJSON(),
      id: `${comment.id}`,
      issueId: `${comment.issueId}`,
    }));
  },
  status: async (parent, args, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    // TODO: parent.issueStatusId does exist but since it is not part of the graphql type it is not available according to typescript
    const issue = await db.Issue.findByPk(Number(parent.id), {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    if (!issue.issueStatusId) return null;

    const issueStatus = await db.IssueStatuses.findByPk(issue.issueStatusId, {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    return {
      ...issueStatus.toJSON(),
      id: `${issueStatus.id}`,
      projectId: `${issueStatus.projectId}`,
    };
  },
  reporter: async (parent, args, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const issue = await db.Issue.findByPk(Number(parent.id), {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    const reporterUser = await db.User.findByPk(Number(issue.reporterId), {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    if (!reporterUser) return null;

    return formatUserForGraphql(reporterUser);
  },
  assignee: async (parent, args, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const databaseIssue = await db.Issue.findByPk(Number(parent.id), {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    if (!databaseIssue?.assigneeId) return null;

    const user = await db.User.findByPk(Number(databaseIssue.assigneeId), {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    return formatUserForGraphql(user);
  },
  project: async (parent, __, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    if (parent.project) return parent.project;

    const databaseProject = await db.Project.findByPk(Number(parent.projectId), {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    return {
      ...databaseProject.toJSON(),
      id: `${databaseProject.id}`,
      visibility: databaseProject.visibility as ProjectVisibility,
      boards: undefined,
      users: undefined,
    };
  },
};

const resolvers: Resolvers = {
  Query,
  Mutation,
  CustomFieldValue,
  Issue,
};

export default resolvers;
