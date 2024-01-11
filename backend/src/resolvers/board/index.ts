import type {
  BoardResolvers,
  MutationResolvers,
  QueryResolvers,
  ViewState,
} from '../../__generated__/resolvers-types.js';
import type { Board as BoardModel } from '../../db/models/types.js';
import { websocketBroadcast } from '../../services/ws-server.js';

const formatBoardResponse = (board: BoardModel) => {
  return {
    ...board.toJSON(),
    id: `${board.id}`,
    projectId: `${board.projectId}`,
    containerOrder: board.containerOrder ? JSON.stringify(board.containerOrder) : undefined,
    settings: board.settings ? JSON.stringify(board.settings) : undefined,
    viewState: board.viewState ? (board.viewState as ViewState[]) : undefined, // TODO: verify this is correct
  };
};

const Query: QueryResolvers = {
  boards: async (parent, args, { db, dataLoaderContext }) => {
    // TODO: should we require a project id to show boards?
    const boards = await db.Board.findAll();

    dataLoaderContext.prime(boards);

    return boards.map(formatBoardResponse);
  },
  board: async (parent, { input: { id } }, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const board = await db.Board.findByPk(Number(id), {
      // include: {
      //   model: db.Issue,
      //   as: 'issues',
      // },
      [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    return formatBoardResponse(board);
  },
};

const Mutation: MutationResolvers = {
  updateBoard: async (parent, { input }, { db, websocketServer, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const { id, name, viewState, backlogEnabled, settings, containerOrder } = input;

    const board = await db.Board.findByPk(Number(id), {
      [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });
    if (name) board.name = name;
    if (typeof viewState !== 'undefined') board.viewState = viewState;
    if (backlogEnabled !== undefined) board.backlogEnabled = backlogEnabled;
    if (typeof settings !== 'undefined') board.settings = JSON.parse(settings);
    // TODO: lets add some more safety checks here
    if (typeof containerOrder !== 'undefined') {
      board.containerOrder = typeof containerOrder === 'string' ? JSON.parse(containerOrder) : null;
    }

    await board.save();

    dataLoaderContext.prime(board);

    websocketBroadcast({
      clients: websocketServer.clients,
      namespace: 'ws',
      message: JSON.stringify({ type: 'BOARD_UPDATED', payload: board.toJSON() }),
    });

    return formatBoardResponse(board);
  },
};

const Board: BoardResolvers = {
  issues: async (parent, args, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const board = await db.Board.findByPk(Number(parent.id), {
      include: {
        model: db.Issue,
        as: 'issues',
      },
      [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    const boardIssues = await db.IssueBoard.findAll({
      where: { boardId: parent.id },
      raw: true,
    });

    dataLoaderContext.prime(boardIssues);

    return board.issues.map((issue) => ({
      ...issue,
      id: `${issue.id}`,
      boardId: `${parent.id}`,
      projectId: `${parent.projectId}`,
      position: boardIssues.find((boardIssue) => Number(boardIssue.issueId) === Number(issue.id)).position,
      project: undefined,
      customFields: undefined,
    }));
  },
  containerOrder: (parent) => {
    return parent.containerOrder ?? undefined;
  },
};

const resolvers = {
  Query,
  Mutation,
  Board,
};

export default resolvers;
