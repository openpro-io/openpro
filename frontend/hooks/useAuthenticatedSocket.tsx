import { useSocket } from 'socket.io-react-hook';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PUBLIC_NEXTAUTH_URL, NEXT_PUBLIC_API_URL } from '@/services/config';

export const getSocketIoRooms = async () => {
  const rooms = ['general'];

  // always subscribe to the user's own channel
  const session = await getSession();
  const userId = session?.user?.id;
  if (userId) rooms.push(`user:${session?.user?.id}`);

  return rooms;
};

const useAuthenticatedSocket = (namespace?: string) => {
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

  // @ts-ignore
  const socket = useSocket(namespace ?? NEXT_PUBLIC_API_URL, {
    enabled: !!accessToken,
    auth: {
      token: accessToken,
    },
  });

  return socket;
};

export default useAuthenticatedSocket;
