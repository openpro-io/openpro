import { isUndefined } from 'lodash-es';

import type { MutationResolvers, QueryResolvers, UserResolvers } from '../../__generated__/resolvers-types.js';
import { User as UserModel } from '../../db/models/types.js';
import { BUCKET_NAME } from '../../services/config.js';
import { minioClient } from '../../services/minio-client.js';

const formatUserResponse = (user: UserModel) => ({
  ...user.toJSON(),
  id: `${user.id}`,
});

const Query: QueryResolvers = {
  users: async (parent, args, { db, dataLoaderContext }) => {
    const dbUsers = await db.User.findAll();

    dataLoaderContext.prime(dbUsers);

    return dbUsers.map(formatUserResponse);
  },
  user: (parent, __, { db }) => {
    // if (externalId) {
    //   return db.User.findOne({ where: { externalId } });
    // }

    // if (id) {
    //   return db.User.findByPk(id);
    // }
    return undefined;
  },
  me: async (parent, args, { db, user, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const dbUser = await db.User.findByPk(Number(user.id), {
      [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    return formatUserResponse(dbUser);
  },
};

const Mutation: MutationResolvers = {
  updateMe: async (parent, { input }, { db, user, dataLoaderContext }) => {
    const { firstName, lastName } = input;

    if (!isUndefined(firstName)) user.firstName = firstName;
    if (!isUndefined(lastName)) user.lastName = lastName;

    await user.save();

    dataLoaderContext.prime(user);

    return formatUserResponse(user);
  },
  assignAssetAsAvatar: async (parent, { input }, { db, user, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const { assetId } = input;
    let findOldAvatarAsset;

    if (user.avatarAssetId) {
      findOldAvatarAsset = await db.Asset.findByPk(Number(user.avatarAssetId), {
        [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
      });
    }

    const findAsset = await db.Asset.findByPk(Number(assetId), {
      [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    user.avatarAssetId = Number(assetId);
    await user.save();

    if (findOldAvatarAsset) {
      // TODO: Remove from minio
      await findOldAvatarAsset.destroy();
      await minioClient.removeObject(BUCKET_NAME, findOldAvatarAsset.assetFilename);
    }

    return {
      ...findAsset.toJSON(),
      id: `${findAsset.id}`,
      ownerId: `${findAsset.ownerId}`,
    };
  },
};

const User: UserResolvers = {
  name: (parent) => `${parent?.firstName} ${parent?.lastName}`,
  avatarUrl: async (parent, args, { db, dataLoaderContext, EXPECTED_OPTIONS_KEY }) => {
    const dbUser = await db.User.findByPk(Number(parent.id), {
      [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    const findAvatarAsset = await db.Asset.findByPk(Number(dbUser.avatarAssetId), {
      [EXPECTED_OPTIONS_KEY]: dataLoaderContext,
    });

    if (findAvatarAsset) {
      return '/' + findAvatarAsset.assetPath;
    }

    return null;
  },
};

const resolvers = {
  Query,
  Mutation,
  User,
};

export default resolvers;
