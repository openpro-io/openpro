import { apolloClient } from '@/services/apollo-client';

const socketMsgHandler = async (message: any) => {
  const msg = typeof message === 'string' ? JSON.parse(message) : message;

  // TODO: This currently fights the board state, need to figure out a better way to do this

  switch (msg?.type) {
    case 'BOARD_UPDATED':
      // await apolloClient.refetchQueries({
      //   include: ['GetProjectInfo', 'GetBoardInfo'],
      // });
      break;

    case 'ISSUE_UPDATED':
      // await apolloClient.refetchQueries({
      //   include: ['GetProjectInfo', 'GetBoardInfo'],
      // });
      break;

    default:
      break;
  }
};

export default socketMsgHandler;
