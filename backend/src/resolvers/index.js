import { mergeResolvers } from '@graphql-tools/merge';
import { v4 as uuidv4 } from 'uuid';

import { ASSET_PROVIDER, BUCKET_NAME } from '../services/config.js';
import { minioClient } from '../services/minio-client.js';
import BoardResolvers from './board/index.js';
import IssueCommentResolvers from './issue-comment/index.js';
import IssueResolvers from './issue/index.js';
import ProjectResolvers from './project/index.js';
import UploadResolvers from './upload/index.js';
import UserResolvers from './user/index.js';

// TODO: make these delete operations with SQL + minio inside a SQL transaction

const miscResolvers = {
  Mutation: {
    createIssueStatus: async (parent, { input }, { db }) => {
      const { projectId, name } = input;

      return await db.sequelize.models.IssueStatuses.create({
        projectId: Number(projectId),
        name,
      });
    },

    deleteAsset: async (parent, { input }, { db }) => {
      const { assetId } = input;

      const findAsset = await db.sequelize.models.Asset.findByPk(assetId);

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

      return await db.sequelize.models.Asset.create({
        ownerId: user.id,
        assetType: '',
        assetSubType: '',
        assetPath: `${BUCKET_NAME}/${assetFilename}`,
        assetProvider: ASSET_PROVIDER,
        assetFilename: assetFilename,
      });
    },

    // uploadAvatar: async (parent, { input }, { db, user }) => {
    //   const { data } = input;
    //   let finalAssetPath = '';
    //
    //   // Split the string on comma
    //   const parts = data.split(',');
    //
    //   // this gets the image extension of the uploaded source image
    //   // const imageExtension = parts[0].split(',')[0].split(';')[0].split(':')[1].replace('image/', '');
    //
    //   const base64Data = new Buffer(parts[1], 'base64');
    //
    //   let image = await sharp(base64Data, {
    //     height: 32,
    //     width: 32,
    //   });
    //
    //   // TODO: lets find more dynamic way to handle this
    //   if (ASSET_PROVIDER === 'filesystem') {
    //     finalAssetPath = `${ASSET_PATH}/avatars/user-${user.id}.webp`;
    //
    //     // Get the directory name from the file path
    //     const finalAssetDirectory = path.dirname(finalAssetPath);
    //
    //     try {
    //       await fs.access(finalAssetDirectory);
    //     } catch (error) {
    //       await fs.mkdir(finalAssetDirectory, { recursive: true });
    //     }
    //
    //     await image.webp().resize({ width: 128, height: 128 }).toFile(finalAssetPath);
    //   } else if (ASSET_PROVIDER === 's3') {
    //     finalAssetPath = `${ASSET_PATH}/avatars/user-${user.id}.webp`;
    //     // TODO: implement s3
    //   }
    //
    //   const findAsset = await db.sequelize.models.Asset.findOne({
    //     where: {
    //       ownerId: user.id,
    //       assetType: 'avatar',
    //       assetSubType: 'image',
    //     },
    //   });
    //
    //   if (findAsset) {
    //     findAsset.updatedAt = new Date();
    //     await findAsset.save();
    //     return findAsset;
    //   }
    //
    //   // TODO: decide if we want to await inside or outside... probably inside for now to catch exceptions
    //   return await db.sequelize.models.Asset.create({
    //     ownerId: user.id,
    //     assetType: 'avatar',
    //     assetSubType: 'image',
    //     assetPath: finalAssetPath,
    //     assetProvider: ASSET_PROVIDER,
    //     assetFilename: path.basename(finalAssetPath),
    //   });
    // },
  },

  Query: {
    helloWorld: () => 'hello world',
  },
};

const resolvers = mergeResolvers([
  miscResolvers,
  IssueResolvers,
  IssueCommentResolvers,
  UploadResolvers,
  UserResolvers,
  BoardResolvers,
  ProjectResolvers,
]);

export default resolvers;
