import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      'http://localhost:3000/api/graphql': {
        headers: {
          'x-graphql-introspection': 'true',
        },
      },
    },
  ],
  documents: ['**/*.ts', '**/*.tsx'],
  generates: {
    'gql/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
