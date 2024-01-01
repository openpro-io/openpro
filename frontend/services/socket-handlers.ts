import { apolloClient } from '@/services/apollo-client';

const socketMsgHandler = async (message: any) => {
  const msg = typeof message === 'string' ? JSON.parse(message) : message;

  switch (msg?.type) {
    case 'BOARD_UPDATED':
      await apolloClient.refetchQueries({
        include: ['GetProjectInfo', 'GetBoardInfo'],
      });
      break;

    case 'ISSUE_UPDATED':
      await apolloClient.refetchQueries({
        include: ['GetProjectInfo', 'GetBoardInfo'],
      });
      break;

    default:
      break;
  }
};

export default socketMsgHandler;
