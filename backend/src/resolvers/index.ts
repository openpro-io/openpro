import { mergeResolvers } from '@graphql-tools/merge';
import { GraphQLDateTime } from 'graphql-scalars';
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
const miscResolvers = {
  DateTime: GraphQLDateTime,
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
