import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
  gql,
  split,
} from '@apollo/client';
import { createFragmentRegistry } from '@apollo/client/cache';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
// TODO: Why isn't typescript picking up the ./types definition for this...
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import axios from 'axios';
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

const uploadLink = createUploadLink({
  uri,
  headers: {
    'apollo-require-preflight': 'true',
  },
});

const batchLink = new BatchHttpLink({
  uri,
  batchMax: 10, // No more than 5 operations per batch
  batchInterval: 30, // Wait no more than 30ms after first batched operation
});

const httpLink = new HttpLink({
  uri,
});

// We process mutations singularly BEFORE processing queries.
// This leads to less race conditions where a mutation and query of same data are in same batch.
export const batchOrNotLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'mutation'
    );
  },
  httpLink,
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
  batchOrNotLink
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
      ViewState: {
        fields: {
          items: {
            merge(existing = [], incoming) {
              // TODO: we should revisit this. I seem to get an error when creating a
              //  new project/board and i create an issue then drag to another column for first time
              //  return [...existing, ...incoming]; ??
              return incoming;
            },
          },
        },
      },
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
                ? DateTime.fromISO(createdAt).toRelative()
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
