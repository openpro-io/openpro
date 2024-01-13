import type { IssueCommentResolvers, MutationResolvers } from '../../__generated__/resolvers-types.js';
import { formatUserForGraphql } from '../user/helpers.js';

const Mutation: MutationResolvers = {
  createIssueComment: async (parent, { input }, { db, user }) => {
    const { issueId, comment, commentRaw } = input;

    const createdIssueComment = await db.IssueComment.create(
      {
        issueId: Number(issueId),
        reporterId: Number(user.id),
        comment,
        // @ts-ignore
        commentRaw: Buffer.from(commentRaw, 'base64'), // TODO: fix this
      },
      {
        returning: true,
      }
    );

    return {
      ...createdIssueComment.toJSON(),
      id: `${createdIssueComment.id}`,
      issueId: `${issueId}`,
    };
  },
  deleteIssueComment: async (parent, { input }, { db }) => {
    const { commentId } = input;

    const findIssueComment = await db.IssueComment.findByPk(commentId);

    if (!findIssueComment) {
      throw new Error('issue comment not found');
    }

    await findIssueComment.destroy();

    return {
      message: 'deleted comment',
      status: 'success',
    };
  },
  updateIssueComment: async (parent, { input }, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const { commentId, comment } = input;

    const findIssueComment = await db.IssueComment.findByPk(Number(commentId), {
      [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    if (!findIssueComment) throw new Error('Issue comment not found');

    findIssueComment.comment = comment;

    await findIssueComment.save();

    dataLoaderContext.prime(findIssueComment);

    return {
      ...findIssueComment.toJSON(),
      id: `${findIssueComment.id}`,
      issueId: `${findIssueComment.issueId}`,
    };
  },
};

const IssueComment: IssueCommentResolvers = {
  reporter: async (parent, args, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const findIssueComment = await db.IssueComment.findByPk(Number(parent.id), {
      [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    const dbUser = await db.User.findByPk(Number(findIssueComment.reporterId), {
      [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    return formatUserForGraphql(dbUser);
  },
};

const resolvers = {
  Query: {},
  Mutation,
  IssueComment,
};

export default resolvers;
