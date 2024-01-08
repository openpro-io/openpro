import { BoardResolvers, MutationResolvers, QueryResolvers } from '../../__generated__/resolvers-types.js';
import { websocketBroadcast } from '../../services/ws-server.js';

const Query: QueryResolvers = {
  boards: (parent, args, { db }) => {
    // TODO: should we require a project id to show boards?
    return db.Board.findAll();
  },
  board: (parent, { input: { id } }, { db }) => {
    return db.Board.findByPk(id, {
      include: {
        model: db.Issue,
        as: 'issues',
      },
    });
  },
};

const Mutation: MutationResolvers = {
  updateBoard: async (parent, { input }, { db, websocketServer }) => {
    const { id, name, viewState, backlogEnabled, settings, containerOrder } = input;

    const board = await db.Board.findByPk(id);
    if (name) board.name = name;
    if (typeof viewState !== 'undefined') board.viewState = viewState;
    if (backlogEnabled !== undefined) board.backlogEnabled = backlogEnabled;
    if (typeof settings !== 'undefined') board.settings = JSON.parse(settings);
    // TODO: lets add some more safety checks here
    if (typeof containerOrder !== 'undefined') {
      board.containerOrder = typeof containerOrder === 'string' ? JSON.parse(containerOrder) : null;
    }

    await board.save();

    websocketBroadcast({
      clients: websocketServer.clients,
      namespace: 'ws',
      message: JSON.stringify({ type: 'BOARD_UPDATED', payload: board.toJSON() }),
    });

    return board;
  },
};

const Board: BoardResolvers = {
  issues: async (parent, args, { db }) => {
    const boardIssues = await db.IssueBoard.findAll({
      where: { boardId: parent.id },
      raw: true,
    });

    return parent.issues.map((issue) => {
      return db.Issue.build({
        ...issue.toJSON(),
        // @ts-ignore
        boardId: parent.id,
        position: boardIssues.find((boardIssue) => Number(boardIssue.issueId) === Number(issue.id)).position,
      });
    });
  },
  containerOrder: (parent) => {
    return parent.containerOrder ? JSON.stringify(parent.containerOrder) : undefined;
  },
};

const resolvers = {
  Query,
  Mutation,
  Board,
};

export default resolvers;
