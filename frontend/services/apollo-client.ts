import { from, ApolloClient, InMemoryCache, gql, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/react';
// TODO: Why isn't typescript picking up the ./types definition for this...
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { DateTime } from 'luxon';
import {
  ISSUE_COMMENT_FIELDS,
  ISSUE_FIELDS,
  USER_FIELDS,
} from '@/gql/gql-queries-mutations';
import { createFragmentRegistry } from '@apollo/client/cache';
import { NEXT_PUBLIC_API_URL } from '@/services/config';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { getMainDefinition } from '@apollo/client/utilities';

const authLink = setContext(async (_, { headers }) => {
  // Get the session
  const session = await getSession();

  // Set the access token to the Authorization header
  const accessToken = session?.accessToken;

  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

const batchLink = new BatchHttpLink({
  uri: 'http://localhost:3000/api/graphql',
  batchMax: 10, // No more than 5 operations per batch
  batchInterval: 30, // Wait no more than 30ms after first batched operation
});

const uploadLink = createUploadLink({
  uri: `http://localhost:3000/api/graphql`,
  headers: {
    'apollo-require-preflight': 'true',
  },
});

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
  batchLink
);

export const apolloClient = new ApolloClient({
  connectToDevTools: true,
  link: from([authLink, splitLink]),
  cache: new InMemoryCache({
    fragments: createFragmentRegistry(gql`
      ${USER_FIELDS}
      ${ISSUE_COMMENT_FIELDS}
      ${ISSUE_FIELDS}
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
              return avatarUrl ? `${NEXT_PUBLIC_API_URL}${avatarUrl}` : null;
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
