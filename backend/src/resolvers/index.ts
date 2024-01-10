import { mergeResolvers } from '@graphql-tools/merge';
import { GraphQLScalarType, Kind } from 'graphql';
import { v4 as uuidv4 } from 'uuid';

import type { Resolvers } from '../__generated__/resolvers-types.js';
import { ASSET_PROVIDER, BUCKET_NAME } from '../services/config.js';
import { minioClient } from '../services/minio-client.js';
import BoardResolvers from './board/index.js';
import IssueCommentResolvers from './issue-comment/index.js';
import IssueResolvers from './issue/index.js';
import ProjectResolvers from './project/index.js';
import UploadResolvers from './upload/index.js';
import UserResolvers from './user/index.js';

// TODO: make these delete operations with SQL + minio inside a SQL transaction

// TODO: lets use this maybe ... https://github.com/excitement-engineer/graphql-iso-date
const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime(); // Convert outgoing Date to integer for JSON
    }
    throw Error('GraphQL Date Scalar serializer expected a `Date` object');
  },
  parseValue(value) {
    if (typeof value === 'number') {
      return new Date(value); // Convert incoming integer to Date
    }
    throw new Error('GraphQL Date Scalar parser expected a `number`');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10));
    }
    // Invalid hard-coded value (not an integer)
    return null;
  },
});

const miscResolvers = {
  Date: dateScalar,
  Mutation: {
    createIssueStatus: async (parent, { input }, { db }) => {
      const { projectId, name } = input;

      return await db.IssueStatuses.create({
        projectId: Number(projectId),
        name,
      });
    },

    deleteAsset: async (parent, { input }, { db }) => {
      const { assetId } = input;

      const findAsset = await db.Asset.findByPk(assetId);

      if (!findAsset) {
        throw new Error('Asset not found');
      }

      await findAsset.destroy();
      await minioClient.removeObject(BUCKET_NAME, findAsset.assetFilename);

      return {
        message: 'success',
        status: 'success',
      };
    },
    uploadAsset: async (parent, { input }, { db, user }) => {
      const { assetExtension, file } = input;

      const { createReadStream, mimetype } = await file;

      const assetFilename = `${uuidv4()}.${assetExtension}`;

      const metaData = {
        'Content-Type': mimetype,
        'Uploaded-By-User-Id': user.id,
      };

      await minioClient.putObject(BUCKET_NAME, assetFilename, createReadStream(), metaData);

      return await db.Asset.create({
        ownerId: user.id,
        assetType: '',
        assetSubType: '',
        assetPath: `${BUCKET_NAME}/${assetFilename}`,
        assetProvider: ASSET_PROVIDER,
        assetFilename: assetFilename,
      });
    },
  },

  Query: {
    helloWorld: () => 'hello world',
  },
};

const resolvers: Resolvers = mergeResolvers([
  miscResolvers,
  IssueResolvers,
  IssueCommentResolvers,
  UploadResolvers,
  UserResolvers,
  BoardResolvers,
  ProjectResolvers,
]);

export default resolvers;
