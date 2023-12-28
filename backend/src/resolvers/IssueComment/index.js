const resolvers = {
  Query: {},
  Mutation: {},
  IssueComment: {
    reporter: (parent, args, { db }) => {
      return db.sequelize.models.User.findByPk(parent.reporterId);
    },
  },
};

export default resolvers;
