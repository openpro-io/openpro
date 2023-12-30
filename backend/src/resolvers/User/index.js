import { isUndefined } from 'lodash-es';

import { BUCKET_NAME } from '../../services/config.js';
import { minioClient } from '../../services/minio-client.js';

const resolvers = {
  Query: {
    users: (parent, args, { db }) => {
      return db.sequelize.models.User.findAll();
    },
    user: (parent, { id, externalId }, { db }) => {
      if (externalId) {
        return db.sequelize.models.User.findOne({ where: { externalId } });
      }

      if (id) {
        return db.sequelize.models.User.findByPk(id);
      }
    },
    me: (parent, args, { db, user }) => {
      return db.sequelize.models.User.findByPk(user.id);
    },
  },
  Mutation: {
    updateMe: async (parent, { input }, { db, user }) => {
      const { firstName, lastName } = input;

      if (!isUndefined(firstName)) user.firstName = firstName;
      if (!isUndefined(lastName)) user.lastName = lastName;

      await user.save();

      return user;
    },
    assignAssetAsAvatar: async (parent, { input }, { db, user }) => {
      const { assetId } = input;
      let findOldAvatarAsset;

      if (user.avatarAssetId) {
        findOldAvatarAsset = await db.sequelize.models.Asset.findByPk(user.avatarAssetId);
      }

      const findAsset = await db.sequelize.models.Asset.findByPk(assetId);

      user.avatarAssetId = assetId;
      await user.save();

      if (findOldAvatarAsset) {
        // TODO: Remove from minio
        await findOldAvatarAsset.destroy();
        await minioClient.removeObject(BUCKET_NAME, findOldAvatarAsset.assetFilename);
      }

      return findAsset;
    },
  },
  User: {
    name: (parent) => `${parent?.firstName} ${parent?.lastName}`,
    avatarUrl: async (parent, args, { db }) => {
      const findAvatarAsset = await db.sequelize.models.Asset.findByPk(parent.avatarAssetId);

      if (findAvatarAsset) {
        return '/' + findAvatarAsset.assetPath;
      }

      return null;
    },
  },
};

export default resolvers;
