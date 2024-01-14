import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8080/graphql',
  generates: {
    'src/__generated__/resolvers-types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        allowParentTypeOverride: true,
        defaultMapper: 'Partial<{T}>',
      },
    },
  },
  hooks: {
    afterOneFileWrite: [
      // "sed -i '' 's/import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from '\\''graphql'\\'';/import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from '\\''graphql'\\'';/g' src/__generated__/resolvers-types.ts",
      // "sed -i '' 's/import { ApolloContext } from '\\''..\\/server\\/apollo.js'\\'';/import type { ApolloContext } from '\\''..\\/server\\/apollo.js'\\'';/g' src/__generated__/resolvers-types.ts",
    ],
  },
  config: {
    useIndexSignature: true,
    contextType: '../server/apollo.js#ApolloContext',
  },
};

export default config;
