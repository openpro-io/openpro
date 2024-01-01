import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import { NEXT_PUBLIC_API_URL, PUBLIC_NEXTAUTH_URL } from '@/services/config';

const useWsAuthenticatedSocket = (options?: any) => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    (async () => {
      const session = await getSession();

      if (session) {
        const { data } = await axios.get(`${PUBLIC_NEXTAUTH_URL}/api/get-jwt`);
        setAccessToken(data.token);
      }
    })();
  }, []);

  const socket = useWebSocket(
    NEXT_PUBLIC_API_URL.replace('https', 'wss').replace('http', 'ws') + '/ws',
    {
      ...(options ?? {}),
      shouldReconnect: (closeEvent) => true,
      heartbeat: {
        message: 'pong',
        returnMessage: 'ping',
        timeout: 35000, // 35 seconds, no response is received, the connection will be closed
        interval: 30000, // every 30 seconds, a ping message will be sent
      },
      protocols: ['Authorization', `${accessToken}`],
    },
    !!accessToken
  );

  return socket;
};

export default useWsAuthenticatedSocket;
