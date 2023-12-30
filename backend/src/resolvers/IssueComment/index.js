const resolvers = {
  Query: {},
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
    deleteIssueComment: async (parent, { input }, { db }) => {
      const { commentId } = input;

      const findIssueComment = await db.sequelize.models.IssueComment.findByPk(commentId);

      if (!findIssueComment) {
        throw new Error('Issue comment not found');
      }

      await findIssueComment.destroy();

      return {
        message: 'deleted comment',
        status: 'success',
      };
    },
    updateIssueComment: async (parent, { input }, { db }) => {
      const { commentId, comment } = input;

      const findIssueComment = await db.sequelize.models.IssueComment.findByPk(commentId);

      if (!findIssueComment) {
        throw new Error('Issue comment not found');
      }

      findIssueComment.comment = comment;
      await findIssueComment.save();

      return findIssueComment;
    },
  },
  IssueComment: {
    reporter: (parent, args, { db }) => {
      return db.sequelize.models.User.findByPk(parent.reporterId);
    },
  },
};

export default resolvers;
