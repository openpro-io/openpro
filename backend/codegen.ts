import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8080/graphql',
  generates: {
    'src/__generated__/resolvers-types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
  config: {
    useIndexSignature: true,
    contextType: '../server/apollo.js#ApolloContext',
    mappers: {
      Project: '../db/models/types.js#Project as ProjectModel',
      ProjectTag: '../db/models/types.js#ProjectTag as ProjectTagModel',
      CustomField: '../db/models/types.js#ProjectCustomField as ProjectCustomFieldModel',
      User: '../db/models/types.js#User as UserModel',
      Issue: '../db/models/types.js#Issue as IssueModel',
      IssueComment: '../db/models/types.js#IssueComment as IssueCommentModel',
      Board: '../db/models/types.js#Board as BoardModel',
      IssueStatus: '../db/models/types.js#IssueStatus as IssueStatusModel',
    },
  },
};

export default config;