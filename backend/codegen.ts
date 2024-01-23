import type { CodegenConfig } from '@graphql-codegen/cli';
import fs from 'fs';

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
      (filePath) => {
        if (filePath.endsWith('resolvers-types.ts')) {
          const content = fs.readFileSync(filePath, 'utf8');

          const graphqlImportRegex =
            /import { (GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig) } from 'graphql';/g;
          const apolloContextImportRegex = /import { (ApolloContext) } from '\.\.\/server\/apollo\.js';/g;

          let modifiedContent = content.replace(graphqlImportRegex, "import type { $1 } from 'graphql';");
          modifiedContent = modifiedContent.replace(
            apolloContextImportRegex,
            "import type { $1 } from '../server/apollo.js';"
          );

          fs.writeFileSync(filePath, modifiedContent);
        }
      },
    ],
  },
  config: {
    useIndexSignature: true,
    contextType: '../server/apollo.js#ApolloContext',
  },
};

export default config;
