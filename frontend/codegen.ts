import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      'http://localhost:8080/graphql': {
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
