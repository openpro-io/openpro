import { apolloClient } from '@/services/apollo-client';

const socketMsgHandler = async (msg: any) => {
  switch (msg.type) {
    case 'BOARD_UPDATED':
      await apolloClient.refetchQueries({
        include: ['GetProjectInfo', 'GetBoardInfo'],
      });
      break;

    default:
      break;
  }
};

export default socketMsgHandler;
