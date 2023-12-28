const resolvers = {
  Query: {
    boards: (parent, args, { db }) => {
      // TODO: should we require a project id to show boards?
      return db.sequelize.models.Board.findAll();
    },
    board: async (parent, { input: { id } }, { db }) => {
      const boardInfo = await db.sequelize.models.Board.findByPk(id, {
        include: db.sequelize.models.Issue,
      });
      return boardInfo;
    },
  },
  Mutation: {
    updateBoard: async (parent, { input }, { db, io }) => {
      const { id, name, viewState, backlogEnabled, settings, containerOrder } = input;

      const board = await db.sequelize.models.Board.findByPk(id);
      if (name) board.name = name;
      if (typeof viewState !== 'undefined') board.viewState = viewState;
      if (backlogEnabled !== undefined) board.backlogEnabled = backlogEnabled;
      if (typeof settings !== 'undefined') board.settings = settings;
      // TODO: lets add some more safety checks here
      if (typeof containerOrder !== 'undefined') {
        board.containerOrder = typeof containerOrder === 'string' ? JSON.parse(containerOrder) : null;
      }

      await board.save();

      // TODO: fix
      // emitBoardUpdatedEvent(io, board.toJSON());

      return board;
    },
  },
  Board: {
    issues: async (parent, args, { db }) => {
      const boardIssues = await db.sequelize.models.IssueBoard.findAll({
        where: { boardId: parent.id },
        raw: true,
      });

      const data = parent.Issues.map((issue) => ({
        ...issue.toJSON(),
        boardId: parent.id,
        position: boardIssues.find((boardIssue) => Number(boardIssue.issueId) === Number(issue.id)).position,
      }));

      return data;
    },
    containerOrder: (parent) => {
      return parent.containerOrder ? JSON.stringify(parent.containerOrder) : undefined;
    },
  },
};

export default resolvers;
