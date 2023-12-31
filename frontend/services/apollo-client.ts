import { ApolloClient, InMemoryCache, from, gql, split } from '@apollo/client';
import { createFragmentRegistry } from '@apollo/client/cache';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
// TODO: Why isn't typescript picking up the ./types definition for this...
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import axios from 'axios';
import { createClient } from 'graphql-ws';
import { DateTime } from 'luxon';

import {
  ISSUE_COMMENT_FIELDS,
  ISSUE_FIELDS,
  PROJECT_ONLY_FIELDS,
  USER_FIELDS,
  VIEW_STATE_FIELDS,
  VIEW_STATE_ISSUE_STATUS_FIELDS,
  VIEW_STATE_ITEM_FIELDS,
} from '@/gql/gql-queries-mutations';
import {
  API_URL,
  NEXT_PUBLIC_API_URL,
  PUBLIC_NEXTAUTH_URL,
} from '@/services/config';

const authLink = setContext(async (_, { headers }) => {
  const { data } = await axios.get(`${PUBLIC_NEXTAUTH_URL}/api/get-jwt`);

  return {
    headers: {
      ...headers,
      Authorization: data.token ? `Bearer ${data.token}` : '',
    },
  };
});

const uri = `${NEXT_PUBLIC_API_URL}/graphql`;

const batchLink = new BatchHttpLink({
  uri,
  batchMax: 10, // No more than 5 operations per batch
  batchInterval: 30, // Wait no more than 30ms after first batched operation
});

const uploadLink = createUploadLink({
  uri,
  headers: {
    'apollo-require-preflight': 'true',
  },
});

const wsClientLink = new GraphQLWsLink(
  createClient({
    url: uri.replace('https', 'wss').replace('http', 'ws'),
    connectionParams: async () => {
      const { data } = await axios.get(`${PUBLIC_NEXTAUTH_URL}/api/get-jwt`);

      return {
        headers: {
          Authorization: data.token ? `Bearer ${data.token}` : '',
        },
      };
    },
  })
);

const wsSplitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsClientLink,
  batchLink
);

export const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'mutation' &&
      definition?.name?.value === 'UploadAsset'
    );
  },
  uploadLink,
  wsSplitLink
);

export const apolloClient = new ApolloClient({
  connectToDevTools: true,
  link: from([authLink, splitLink]),
  cache: new InMemoryCache({
    fragments: createFragmentRegistry(gql`
      ${USER_FIELDS}
      ${ISSUE_COMMENT_FIELDS}
      ${ISSUE_FIELDS}
      ${VIEW_STATE_ITEM_FIELDS}
      ${VIEW_STATE_ISSUE_STATUS_FIELDS}
      ${VIEW_STATE_FIELDS}
      ${PROJECT_ONLY_FIELDS}
    `),
    typePolicies: {
      Board: {
        fields: {
          settings: {
            read(settings) {
              return typeof settings === 'string'
                ? JSON.parse(settings)
                : settings;
            },
          },
        },
      },
      IssueComment: {
        fields: {
          createdAtTimeAgo: {
            read(_, { readField }) {
              const createdAt: string | undefined = readField('createdAt');
              return createdAt
                ? DateTime.fromMillis(Number(createdAt)).toRelative()
                : null;
            },
          },
        },
      },
      User: {
        fields: {
          name: {
            read(_, { readField }) {
              return `${readField('firstName')} ${readField('lastName')}`;
            },
          },
          fullAvatarUrl: {
            read(_, { readField }) {
              const avatarUrl = readField('avatarUrl');
              return avatarUrl
                ? `${API_URL ?? NEXT_PUBLIC_API_URL}${avatarUrl}`
                : null;
            },
          },
        },
      },
      Query: {
        fields: {
          issue: {
            keyArgs: ['input', ['id']],
          },
        },
      },
    },
  }),
});
