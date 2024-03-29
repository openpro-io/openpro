import { arrayMoveImmutable } from 'array-move';
import { isUndefined, sortBy } from 'lodash-es';

import type {
  Board,
  BoardResolvers,
  MutationResolvers,
  Project,
  QueryResolvers,
  Resolver,
  ResolverTypeWrapper,
  ViewState,
  ViewStateItemResolvers,
} from '../../__generated__/resolvers-types.js';
import type { Board as BoardModel } from '../../db/models/types.js';
import type { ApolloContext } from '../../server/apollo';
import { websocketBroadcast } from '../../services/ws-server.js';

const buildViewState = (board: BoardModel): ViewState[] => {
  return sortBy(
    board.containers.map((container) => {
      const containerData = container.toJSON();

      return {
        ...containerData,
        id: `container-${containerData.id}`,
        // @ts-ignore
        items: sortBy(containerData.items, 'position').map((item) => ({
          ...item,
          id: `item-${item.issue.id}`,
        })),
      };
    }),
    'position'
  );
};

export const formatBoardResponse = (board: BoardModel): Board => {
  return {
    ...board.toJSON(),
    id: `${board.id}`,
    projectId: `${board.projectId}`,
    containerOrder: board.containerOrder ? JSON.stringify(board.containerOrder) : undefined,
    settings: board.settings ? JSON.stringify(board.settings) : undefined,
    viewState: buildViewState(board),
    version: Number(board.version),
  };
};

const ViewStateItem: ViewStateItemResolvers = {
  title: async (parent, __, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const issue = await db.Issue.findByPk(Number(parent.id.replace('item-', '')), {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    return issue?.title ?? null;
  },
  status: async (parent, __, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    try {
      const issue = await db.Issue.findByPk(Number(parent.id.replace('item-', '')), {
        // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
        include: {
          model: db.IssueStatuses,
          as: 'issueStatus',
        },
      });

      return {
        id: `${issue.issueStatus.id}`,
        projectId: `${issue.issueStatus.projectId}`,
        name: `${issue.issueStatus.name}`,
      };
    } catch (error) {
      console.error({ error });
      return null;
    }
  },
};

export const boards: Resolver<ResolverTypeWrapper<Partial<Board>>[], Project | undefined, ApolloContext, {}> = async (
  parent,
  args,
  { db, dataLoaderContext },
  info
) => {
  const additionalOptions = {};

  const isParentTypeProject = info?.parentType?.name === 'Project';

  if (isParentTypeProject && parent.id) {
    additionalOptions['where'] = {
      projectId: parent.id,
    };
  }

  const boards = await db.Board.findAll({
    ...additionalOptions,
    include: [
      {
        model: db.BoardContainer,
        as: 'containers',
        include: [
          {
            model: db.ContainerItem,
            as: 'items',
            include: [
              {
                model: db.Issue,
                as: 'issue',
              },
            ],
          },
        ],
      },
    ],
  });

  // dataLoaderContext.prime(boards);

  return boards.map(formatBoardResponse);
};

const Query: QueryResolvers = {
  boards,
  board: async (parent, { input: { id } }, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const board = await db.Board.findByPk(Number(id), {
      include: [
        {
          model: db.BoardContainer,
          as: 'containers',
          include: [
            {
              model: db.ContainerItem,
              as: 'items',
              include: [
                {
                  model: db.Issue,
                  as: 'issue',
                },
              ],
            },
          ],
        },
      ],
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    return formatBoardResponse(board);
  },
};

const Mutation: MutationResolvers = {
  updateViewState: async (
    parent,
    { input: { id, positionIndex } },
    { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }
  ) => {
    const result = await db.sequelize.transaction(async (transaction) => {
      const container = await db.BoardContainer.findByPk(Number(id.replace('container-', '')), { transaction });

      if (!container) throw Error('Container not found');

      const board = await db.Board.findByPk(Number(container.boardId), {
        include: [
          {
            model: db.BoardContainer,
            as: 'containers',
            include: [
              {
                model: db.ContainerItem,
                as: 'items',
                include: [
                  {
                    model: db.Issue,
                    as: 'issue',
                  },
                ],
              },
            ],
          },
        ],
        // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
        transaction,
      });

      board.version += 1;

      await board.save({ transaction });

      const sortedItems = arrayMoveImmutable(
        board.containers,
        board.containers.findIndex((boardContainer) => boardContainer.id === container.id),
        positionIndex
      );

      for (let i = 0; i < sortedItems.length; i++) {
        sortedItems[i].position = i;
      }

      await Promise.all(sortedItems.map((item) => item.save({ transaction })));
      await board.reload({ transaction });

      return board;
    });

    return buildViewState(result);
  },
  createViewState: async (
    parent,
    { input: { boardId, positionIndex, title } },
    { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }
  ) => {
    const board = await db.Board.findByPk(Number(boardId), {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    return formatBoardResponse(board).viewState;
  },
  addItemToViewState: async (
    parent,
    { input: { boardId, issueId, viewStateId, columnPositionIndex } },
    { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }
  ) => {
    const result = await db.sequelize.transaction(async (transaction) => {
      const board = await db.Board.findByPk(Number(boardId), {
        include: [
          {
            model: db.BoardContainer,
            as: 'containers',
            include: [
              {
                model: db.ContainerItem,
                as: 'items',
                include: [
                  {
                    model: db.Issue,
                    as: 'issue',
                  },
                ],
              },
            ],
          },
        ],
        // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
        transaction,
      });

      board.version += 1;

      await board.save({ transaction });

      const doesIssueExist = await db.Issue.findByPk(Number(issueId), {
        transaction,
        // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
      });
      if (!doesIssueExist) {
        throw new Error(`Issue with id ${issueId} does not exist`);
      }

      const existingBoardContainer = board.containers.find((container) =>
        container.items.some((item) => Number(item.issueId) === Number(issueId))
      );

      const destinationBoardContainer = board.containers.find(
        (container) => container.id === Number(viewStateId.replace('container-', ''))
      );

      const existingItem = existingBoardContainer?.items.find((item) => Number(item.issueId) === Number(issueId));

      let incomingItem = null;

      if (isUndefined(columnPositionIndex)) {
        columnPositionIndex = Math.max(destinationBoardContainer?.items?.length - 1, 0);
      }

      if (existingItem) {
        existingItem.position = columnPositionIndex;
        existingItem.containerId = Number(viewStateId.replace('container-', ''));
        await existingItem.save({ transaction });
        incomingItem = existingItem;
      } else {
        incomingItem = await db.ContainerItem.create(
          {
            containerId: Number(viewStateId.replace('container-', '')),
            issueId: Number(issueId),
            position: columnPositionIndex,
          },
          { transaction }
        );
      }

      // dataLoaderContext.prime(incomingItem);

      await board.reload({ transaction });
      // dataLoaderContext.prime(board);

      const destinationBoardContainerUpdated = board.containers.find(
        (container) => container.id === Number(viewStateId.replace('container-', ''))
      );

      // TODO: Testing out row level locking for re-ordering container items
      // const containerItems = sortBy(destinationBoardContainerUpdated.items, 'position');
      const containerItems = await db.ContainerItem.findAll({
        where: {
          containerId: destinationBoardContainerUpdated.id,
        },
        order: [['position', 'ASC']],
        lock: true,
        transaction,
      });

      const sortedItems = arrayMoveImmutable(
        containerItems,
        containerItems.findIndex((item) => item.id === incomingItem.id),
        columnPositionIndex
      );

      for (let i = 0; i < sortedItems.length; i++) {
        sortedItems[i].position = i;
      }

      await Promise.all(sortedItems.map((item) => item.save({ transaction })));
      // dataLoaderContext.prime(sortedItems);
      await board.reload({ transaction });
      // dataLoaderContext.prime(board);

      return board;
    });

    return buildViewState(result);
  },
  updateBoard: async (parent, { input }, { db, websocketServer, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const { id, name, viewState, backlogEnabled, settings, containerOrder } = input;

    const board = await db.Board.findByPk(Number(id), {
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
      include: [
        {
          model: db.BoardContainer,
          as: 'containers',
          include: [
            {
              model: db.ContainerItem,
              as: 'items',
              include: [
                {
                  model: db.Issue,
                  as: 'issue',
                },
              ],
            },
          ],
        },
      ],
    });
    if (name) board.name = name;
    // if (typeof viewState !== 'undefined') board.viewState = viewState;
    if (backlogEnabled !== undefined) board.backlogEnabled = backlogEnabled;
    if (typeof settings !== 'undefined') board.settings = JSON.parse(settings);
    // TODO: lets add some more safety checks here
    if (typeof containerOrder !== 'undefined') {
      board.containerOrder = typeof containerOrder === 'string' ? JSON.parse(containerOrder) : null;
    }

    await board.save();
    await board.reload();

    // dataLoaderContext.prime(board);

    websocketBroadcast({
      clients: websocketServer.clients,
      namespace: 'ws',
      message: JSON.stringify({ type: 'BOARD_UPDATED', payload: board.toJSON() }),
    });

    return formatBoardResponse(board);
  },
};

const Board: BoardResolvers = {
  // TODO: this section needs some improvement
  issues: async (parent, args, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const board = await db.Board.findByPk(Number(parent.id), {
      include: {
        model: db.Issue,
        as: 'issues',
      },
      // [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    const boardIssueIdsFromViewState = board.viewState
      // TODO: its typed as object when its an array
      // @ts-ignore
      .flatMap((container) => container.items)
      .map((item) => Number(item.id.replace('item-', '')));

    const issuesInViewState = await db.Issue.findAll({
      where: {
        id: boardIssueIdsFromViewState,
      },
    });

    const boardIssues = await db.IssueBoard.findAll({
      where: { boardId: parent.id },
      raw: true,
    });

    // dataLoaderContext.prime(boardIssues);

    return issuesInViewState.map((issue) => ({
      ...issue.toJSON(),
      id: `${issue.id}`,
      boardId: `${parent.id}`,
      projectId: `${parent.projectId}`,
      position: boardIssues.find((boardIssue) => Number(boardIssue.issueId) === Number(issue.id))?.position,
      project: undefined,
      customFields: undefined,
    }));
  },
  containerOrder: (parent) => {
    return parent.containerOrder ?? undefined;
  },
};

const resolvers = {
  ViewStateItem,
  Query,
  Mutation,
  Board,
};

export default resolvers;
