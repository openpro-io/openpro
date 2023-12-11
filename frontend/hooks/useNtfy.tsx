import useWebSocket from 'react-use-websocket';
import { Options, WebSocketHook } from 'react-use-websocket/src/lib/types';
import { getSession } from 'next-auth/react';
import { useCallback } from 'react';
import {
  NFTY_WS_HOST,
  NFTY_WS_SSL,
  PUBLIC_NFTY_HTTP_HOST,
  PUBLIC_NFTY_HTTP_SSL,
} from '@/services/config';
import { subscriptionsTable } from '@/database/database.config';
import Dexie from 'dexie';

type BaseUrlType = { http: string; ws: string };

const getBaseUrl = (): BaseUrlType => {
  const wsUrlPrefix = NFTY_WS_SSL ? 'wss://' : 'ws://';

  return {
    http: `${PUBLIC_NFTY_HTTP_HOST}`,
    ws: `${wsUrlPrefix}${NFTY_WS_HOST}`,
  };
};

const createChannelObject = (
  baseUrl: string,
  channel: string,
  connectionType: string
) => ({
  id: `${baseUrl}/${channel}`,
  topic: channel,
  baseUrl,
  connectionType,
  last: '',
  mutedUntil: 0,
});

export const getNftyChannels = async ({
  channels,
  additionalChannels,
}: {
  channels?: string[];
  additionalChannels?: string[];
}) => {
  let channelsToUse = ['general', ...(additionalChannels ?? [])];

  // If channels are passed in, use those instead
  if (channels) channelsToUse = channels;

  // always subscribe to the user's own channel
  const session = await getSession();
  const userId = session?.user?.id;
  if (userId) channelsToUse.push(`user-${session?.user?.id}`);

  const baseUrls = getBaseUrl();

  const channelsToPushIntoDb = channelsToUse.flatMap((channel) =>
    (Object.keys(baseUrls) as Array<keyof BaseUrlType>).map((connectionType) =>
      createChannelObject(baseUrls[connectionType], channel, connectionType)
    )
  );

  subscriptionsTable
    .bulkAdd(channelsToPushIntoDb)
    .catch(Dexie.BulkError, (error) => {
      if (
        !error.toString().includes('Key already exists in the object store.')
      ) {
        return Promise.reject(error);
      }
    });

  return channelsToUse;
};

export const getNtfyHttpUrl = async ({
  channels,
  additionalChannels,
  subscriptionType,
}: {
  channels?: string[];
  additionalChannels?: string[];
  subscriptionType: 'sse' | 'ws' | 'json';
}) => {
  const channelsToUse = await getNftyChannels({ channels, additionalChannels });

  return `${getBaseUrl().http}/${channelsToUse.join(',')}/${subscriptionType}`;
};

const getSocketUrl = async ({
  channels,
  additionalChannels,
}: {
  channels?: string[];
  additionalChannels?: string[];
}) => {
  const channelsToUse = await getNftyChannels({ channels, additionalChannels });

  const channelsToUseString = channelsToUse.join(',');

  return `${getBaseUrl().ws}/${channelsToUseString}/ws`;
};

const useNtfy = ({
  channels,
  additionalChannels,
  nftyOptions,
}: {
  channels?: string[];
  additionalChannels?: string[];
  nftyOptions?: Options;
} = {}): WebSocketHook => {
  const getSocketUrlCb = useCallback(() => {
    return getSocketUrl({ channels, additionalChannels });
  }, [channels, additionalChannels]);

  return useWebSocket(getSocketUrlCb, {
    // onOpen: () => console.log('opened'),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
    share: true,
    ...(nftyOptions ?? {}),
  });
};

export default useNtfy;
